from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str
    user_type: str  # "recruiter" or "candidate"
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: Optional[str]
    user_type: str
    company: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Resume Schemas
class ResumeResponse(BaseModel):
    id: str
    filename: str
    skills: Optional[List[str]]
    experience_years: Optional[int]
    github_projects: Optional[List[dict]]
    is_primary: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Job Schemas
class JobCreate(BaseModel):
    title: str
    description: str
    required_skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

class JobResponse(BaseModel):
    id: str
    title: str
    description: str
    required_skills: Optional[List[str]]
    experience_level: Optional[str]
    salary_range: Optional[str]
    location: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Job Match Schemas
class JobMatchResponse(BaseModel):
    id: str
    job_id: str
    match_score: float
    matched_skills: Optional[List[str]]
    missing_skills: Optional[List[str]]
    bias_risk_level: Optional[str]
    bias_findings: Optional[List[dict]]
    projects_verified: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Hiring Decision Schemas
class HiringDecisionCreate(BaseModel):
    candidate_id: str
    status: str
    feedback: Optional[str] = None

class HiringDecisionResponse(BaseModel):
    id: str
    job_id: str
    candidate_id: str
    status: str
    match_score: Optional[float]
    feedback: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Analytics Schemas
class AnalyticsResponse(BaseModel):
    total_jobs: int
    total_candidates: int
    average_match_score: float
    hiring_funnel: dict
    bias_alerts: int
    top_skills: List[str]
