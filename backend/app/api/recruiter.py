from fastapi import APIRouter, UploadFile, Form, HTTPException
from app.services.ai_engine import rank_resumes, calculate_match
from app.services.resume_service import save_and_extract_resume
from app.services.bias_checker import check_bias, detect_bias
from app.services.github_verifier import GitHubVerifier

router = APIRouter(prefix="/recruiter")

@router.post("/rank-candidates")
async def rank_candidates(job_description: str = Form(...), resumes: list[UploadFile] = Form(...)):
    try:
        data = []
        for r in resumes:
            _, text = save_and_extract_resume(r)
            data.append((r.filename, text))
        return rank_resumes(data, job_description)
    except Exception as e:
        print(f"Error in rank_candidates: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/check-jd-bias")
async def check_jd_bias(jd: UploadFile, resume: UploadFile):
    """Check for bias in JD against resume"""
    try:
        _, jd_text = save_and_extract_resume(jd)
        _, resume_text = save_and_extract_resume(resume)
        
        bias_result = check_bias(jd_text, resume_text)
        
        return {
            "jd_filename": jd.filename,
            "resume_filename": resume.filename,
            "bias_risk": bias_result.get("risk_level", "Low"),
            "findings": bias_result.get("findings", []),
            "recommendations": bias_result.get("recommendations", []),
            "overall_score": bias_result.get("overall_score", 80)
        }
    except Exception as e:
        print(f"Error in check_jd_bias: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-jd")
async def analyze_jd(jd: UploadFile):
    """Analyze job description"""
    try:
        _, jd_text = save_and_extract_resume(jd)
        
        # Extract skills and requirements
        keywords = ['python', 'javascript', 'react', 'java', 'sql', 'aws', 'docker', 'kubernetes', 'typescript', 'node.js', 'machine learning', 'data analysis']
        required_skills = [kw for kw in keywords if kw in jd_text.lower()]
        
        return {
            "filename": jd.filename,
            "word_count": len(jd_text.split()),
            "required_skills": required_skills,
            "text_preview": jd_text[:500]
        }
    except Exception as e:
        print(f"Error in analyze_jd: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bulk-analyze-resumes")
async def bulk_analyze_resumes(job_description: str = Form(...), resumes: list[UploadFile] = Form(...)):
    """Analyze multiple resumes against job description with GitHub verification"""
    try:
        results = []
        
        for resume_file in resumes:
            try:
                resume_id, resume_text = save_and_extract_resume(resume_file)
                
                # Get match score
                match_result = calculate_match(resume_text, job_description)
                
                # Extract and verify GitHub projects
                github_projects = GitHubVerifier.extract_github_links(resume_text)
                verified_count = sum(1 for p in github_projects if p.get("exists", False))
                
                # Extract skills
                skill_keywords = ['python', 'javascript', 'react', 'java', 'sql', 'aws', 'docker', 'git', 'typescript', 'nodejs', 'fastapi', 'django', 'flask', 'postgresql', 'mongodb']
                skills = [kw for kw in skill_keywords if kw in resume_text.lower()]
                
                results.append({
                    "filename": resume_file.filename,
                    "resume_id": resume_id,
                    "match_score": match_result.get("match_score", 0),
                    "matched_skills": match_result.get("matched_skills", []),
                    "missing_skills": match_result.get("missing_skills", []),
                    "experience_years": match_result.get("experience_years", 0),
                    "all_skills": list(set(skills)),
                    "github_projects": github_projects,
                    "verified_projects": verified_count,
                    "total_projects": len(github_projects)
                })
            except Exception as e:
                print(f"Error processing resume {resume_file.filename}: {e}")
                # Continue with other resumes even if one fails
                continue
        
        if not results:
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
