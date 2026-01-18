from fastapi import APIRouter, UploadFile, Form, HTTPException
from app.services.resume_service import save_and_extract_resume
from app.services.ai_engine import calculate_match
from app.services.bias_checker import check_bias, detect_bias
from app.services.github_verifier import GitHubVerifier

router = APIRouter(prefix="/candidate")

@router.post("/match-resume")
async def match_resume(job_description: str = Form(...), resume: UploadFile = Form(...)):
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
        print(f"Error in match_resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
