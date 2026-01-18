from fastapi import APIRouter, UploadFile, Form, HTTPException, Depends, status
from sqlalchemy.orm import Session
import uuid
from app.database import get_db
from app.models import Resume, Job, JobMatch
from app.schemas import ResumeResponse, JobResponse
from app.auth import get_current_candidate
from app.services.resume_service import save_and_extract_resume
from app.services.ai_engine import calculate_match
from app.services.bias_checker import check_bias, detect_bias
from app.services.github_verifier import GitHubVerifier

router = APIRouter(prefix="/candidate", tags=["candidate"])

@router.post("/resumes", response_model=ResumeResponse)
async def upload_resume(
    resume: UploadFile = Form(...),
    current_user: dict = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Upload a new resume"""
    try:
        resume_id, resume_text = save_and_extract_resume(resume)
        
        # Extract skills
        skill_keywords = ['python', 'javascript', 'react', 'java', 'sql', 'aws', 'docker', 'git', 'typescript', 'nodejs', 'fastapi', 'django', 'flask', 'postgresql', 'mongodb', 'kubernetes']
        skills = [kw for kw in skill_keywords if kw in resume_text.lower()]
        
        # Extract GitHub projects
        github_projects = GitHubVerifier.extract_github_links(resume_text)
        
        # Save resume to database
        resume_obj = Resume(
            id=resume_id,
            candidate_id=current_user["sub"],
            filename=resume.filename,
            file_path=str(resume_id + "_" + resume.filename),
            extracted_text=resume_text[:1000],  # Store first 1000 chars
            skills=skills,
            github_projects=github_projects,
            is_primary=True  # Set as primary for now
        )
        db.add(resume_obj)
        db.commit()
        db.refresh(resume_obj)
        
        return ResumeResponse.from_orm(resume_obj)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/resumes", response_model=list[ResumeResponse])
async def get_resumes(
    current_user: dict = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get all resumes for candidate"""
    resumes = db.query(Resume).filter(Resume.candidate_id == current_user["sub"]).all()
    return [ResumeResponse.from_orm(r) for r in resumes]

@router.post("/match-resume")
async def match_resume(
    job_description: str = Form(...),
    resume: UploadFile = Form(...),
    current_user: dict = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Match resume against job description"""
    try:
        resume_id, resume_text = save_and_extract_resume(resume)
        match_result = calculate_match(resume_text, job_description)
        
        # Add bias check
        bias_result = check_bias(job_description, resume_text)
        
        # Extract and verify GitHub projects
        github_projects = GitHubVerifier.extract_github_links(resume_text)
        
        return {
            "resume_id": resume_id,
            "filename": resume.filename,
            "match_score": match_result.get("match_score", 0),
            "matched_skills": match_result.get("matched_skills", []),
            "missing_skills": match_result.get("missing_skills", []),
            "experience_years": match_result.get("experience_years", 0),
            "bias_risk": bias_result.get("risk_level", "Low"),
            "bias_findings": bias_result.get("findings", []),
            "github_projects": github_projects,
            "projects_verified": sum(1 for p in github_projects if p.get("exists", False))
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/analyze-resume")
async def analyze_resume(resume: UploadFile):
    """Analyze resume without job matching"""
    resume_id, resume_text = save_and_extract_resume(resume)
    
    # Extract skills
    skill_keywords = ['python', 'javascript', 'react', 'java', 'sql', 'aws', 'docker', 'git', 'typescript', 'nodejs', 'fastapi', 'django', 'flask', 'postgresql', 'mongodb', 'kubernetes', 'tensorflow', 'pytorch']
    skills = [kw for kw in skill_keywords if kw in resume_text.lower()]
    
    # Extract GitHub projects
    github_projects = GitHubVerifier.extract_github_links(resume_text)
    
    return {
        "resume_id": resume_id,
        "filename": resume.filename,
        "skills": list(set(skills)),
        "word_count": len(resume_text.split()),
        "github_projects": github_projects,
        "verified_projects": sum(1 for p in github_projects if p.get("exists", False))
    }

@router.get("/jobs", response_model=list[JobResponse])
async def get_matching_jobs(
    current_user: dict = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get jobs that match candidate's skills"""
    # Get candidate's primary resume
    resume = db.query(Resume).filter(
        (Resume.candidate_id == current_user["sub"]) & (Resume.is_primary == True)
    ).first()
    
    if not resume:
        return []
    
    # Get all active jobs
    jobs = db.query(Job).filter(Job.is_active == True).all()
    
    # Score jobs based on skill match
    scored_jobs = []
    for job in jobs:
        if job.required_skills:
            match_count = len([s for s in job.required_skills if s in resume.skills])
            score = (match_count / len(job.required_skills)) * 100 if job.required_skills else 0
            if score > 0:
                scored_jobs.append((job, score))
    
    # Sort by score and return
    scored_jobs.sort(key=lambda x: x[1], reverse=True)
    return [JobResponse.from_orm(job) for job, _ in scored_jobs]

@router.get("/applied-jobs")
async def get_applied_jobs(
    current_user: dict = Depends(get_current_candidate),
    db: Session = Depends(get_db)
):
    """Get all jobs candidate has applied to"""
    # This would need to track applications - simplified version
    return {"message": "Tracking applications in progress"}
