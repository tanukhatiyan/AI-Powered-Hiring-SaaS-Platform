from fastapi import APIRouter, UploadFile, Form, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
import uuid
from app.database import get_db
from app.models import Job, Resume, JobMatch, HiringDecision, User
from app.schemas import JobCreate, JobUpdate, JobResponse, JobMatchResponse, HiringDecisionCreate, HiringDecisionResponse
from app.auth import get_current_recruiter
from app.services.ai_engine import rank_resumes, calculate_match
from app.services.resume_service import save_and_extract_resume
from app.services.bias_checker import check_bias, detect_bias
from app.services.github_verifier import GitHubVerifier

router = APIRouter(prefix="/recruiter", tags=["recruiter"])

@router.post("/jobs", response_model=JobResponse)
async def create_job(
    job_data: JobCreate,
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Create a new job posting"""
    job = Job(
        id=str(uuid.uuid4()),
        recruiter_id=current_user["sub"],
        title=job_data.title,
        description=job_data.description,
        required_skills=job_data.required_skills,
        experience_level=job_data.experience_level,
        salary_range=job_data.salary_range,
        location=job_data.location
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return JobResponse.from_orm(job)

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get job details"""
    job = db.query(Job).filter(
        and_(Job.id == job_id, Job.recruiter_id == current_user["sub"])
    ).first()
    
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return JobResponse.from_orm(job)

@router.get("/jobs", response_model=list[JobResponse])
async def list_jobs(
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """List all jobs for recruiter"""
    jobs = db.query(Job).filter(Job.recruiter_id == current_user["sub"]).all()
    return [JobResponse.from_orm(job) for job in jobs]

@router.put("/jobs/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    job_data: JobUpdate,
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Update job posting"""
    job = db.query(Job).filter(
        and_(Job.id == job_id, Job.recruiter_id == current_user["sub"])
    ).first()
    
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    update_data = job_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    
    db.commit()
    db.refresh(job)
    return JobResponse.from_orm(job)

@router.post("/jobs/{job_id}/rank-candidates")
async def rank_candidates(
    job_id: str,
    resumes: list[UploadFile] = Form(...),
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Rank candidates for a job"""
    job = db.query(Job).filter(
        and_(Job.id == job_id, Job.recruiter_id == current_user["sub"])
    ).first()
    
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    try:
        results = []
        for resume_file in resumes:
            try:
                resume_id, resume_text = save_and_extract_resume(resume_file)
                
                # Calculate match
                match_result = calculate_match(resume_text, job.description)
                
                # Check bias
                bias_result = check_bias(job.description, resume_text)
                
                # Extract GitHub projects
                github_projects = GitHubVerifier.extract_github_links(resume_text)
                verified_count = sum(1 for p in github_projects if p.get("exists", False))
                
                # Save to database
                job_match = JobMatch(
                    id=str(uuid.uuid4()),
                    job_id=job_id,
                    resume_id=resume_id,
                    match_score=match_result.get("match_score", 0),
                    matched_skills=match_result.get("matched_skills", []),
                    missing_skills=match_result.get("missing_skills", []),
                    bias_risk_level=bias_result.get("risk_level", "Low"),
                    bias_findings=bias_result.get("findings", []),
                    projects_verified=verified_count
                )
                db.add(job_match)
                
                results.append({
                    "filename": resume_file.filename,
                    "resume_id": resume_id,
                    "match_score": match_result.get("match_score", 0),
                    "matched_skills": match_result.get("matched_skills", []),
                    "missing_skills": match_result.get("missing_skills", []),
                    "bias_risk": bias_result.get("risk_level", "Low"),
                    "github_projects": github_projects,
                    "verified_projects": verified_count
                })
            except Exception as e:
                print(f"Error processing resume {resume_file.filename}: {e}")
                continue
        
        db.commit()
        return {
            "job_id": job_id,
            "total_resumes": len(results),
            "results": sorted(results, key=lambda x: x["match_score"], reverse=True)
        }
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/jobs/{job_id}/candidates", response_model=list[JobMatchResponse])
async def get_job_candidates(
    job_id: str,
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get all candidates for a job sorted by match score"""
    job = db.query(Job).filter(
        and_(Job.id == job_id, Job.recruiter_id == current_user["sub"])
    ).first()
    
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    matches = db.query(JobMatch).filter(JobMatch.job_id == job_id).order_by(JobMatch.match_score.desc()).all()
    return [JobMatchResponse.from_orm(match) for match in matches]

@router.post("/candidates/{candidate_id}/decision", response_model=HiringDecisionResponse)
async def make_hiring_decision(
    candidate_id: str,
    decision_data: HiringDecisionCreate,
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Make hiring decision for a candidate"""
    job = db.query(Job).filter(Job.id == decision_data.job_id).first()
    if not job or job.recruiter_id != current_user["sub"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Check if decision already exists
    existing_decision = db.query(HiringDecision).filter(
        and_(
            HiringDecision.job_id == decision_data.job_id,
            HiringDecision.candidate_id == candidate_id
        )
    ).first()
    
    if existing_decision:
        existing_decision.status = decision_data.status
        existing_decision.feedback = decision_data.feedback
        db.commit()
        db.refresh(existing_decision)
        return HiringDecisionResponse.from_orm(existing_decision)
    
    decision = HiringDecision(
        id=str(uuid.uuid4()),
        job_id=decision_data.job_id,
        candidate_id=candidate_id,
        status=decision_data.status,
        feedback=decision_data.feedback,
        created_by=current_user["sub"]
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return HiringDecisionResponse.from_orm(decision)

@router.get("/analytics")
async def get_analytics(
    current_user: dict = Depends(get_current_recruiter),
    db: Session = Depends(get_db)
):
    """Get recruiter analytics"""
    # Total jobs
    total_jobs = db.query(Job).filter(Job.recruiter_id == current_user["sub"]).count()
    
    # Total candidates matched
    recruiter_jobs = db.query(Job.id).filter(Job.recruiter_id == current_user["sub"]).all()
    job_ids = [j[0] for j in recruiter_jobs]
    total_candidates = db.query(JobMatch).filter(JobMatch.job_id.in_(job_ids)).count() if job_ids else 0
    
    # Average match score
    matches = db.query(JobMatch).filter(JobMatch.job_id.in_(job_ids)).all() if job_ids else []
    avg_score = sum([m.match_score for m in matches]) / len(matches) if matches else 0
    
    # Hiring funnel
    decisions = db.query(HiringDecision).filter(HiringDecision.job_id.in_(job_ids)).all() if job_ids else []
    funnel = {
        "applied": len([d for d in decisions if d.status == "applied"]),
        "shortlisted": len([d for d in decisions if d.status == "shortlisted"]),
        "rejected": len([d for d in decisions if d.status == "rejected"]),
        "offered": len([d for d in decisions if d.status == "offered"]),
        "hired": len([d for d in decisions if d.status == "hired"])
    }
    
    # Bias alerts
    bias_alerts = len([m for m in matches if m.bias_risk_level == "High"])
    
    return {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "average_match_score": round(avg_score, 2),
        "hiring_funnel": funnel,
        "bias_alerts": bias_alerts,
        "top_skills": ["Python", "JavaScript", "React", "AWS", "Docker"]  # Can be calculated from data
    }
            raise HTTPException(status_code=400, detail="Could not process any resumes")
        
        # Sort by match score
        results.sort(key=lambda x: x["match_score"], reverse=True)
        
        return {
            "total_candidates": len(results),
            "candidates": results,
            "top_candidate": results[0] if results else None
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in bulk_analyze_resumes: {e}")
        raise HTTPException(status_code=500, detail=str(e))
