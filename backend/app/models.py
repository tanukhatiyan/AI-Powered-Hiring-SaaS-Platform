from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    user_type = Column(String, nullable=False)  # "recruiter" or "candidate"
    full_name = Column(String, nullable=True)
    company = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    resumes = relationship("Resume", back_populates="candidate")
    jobs = relationship("Job", back_populates="recruiter")
    decisions = relationship("HiringDecision", back_populates="recruiter")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(String, primary_key=True, index=True)
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    extracted_text = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True)  # List of extracted skills
    experience_years = Column(Integer, nullable=True)
    github_projects = Column(JSON, nullable=True)  # List of GitHub projects
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    candidate = relationship("User", back_populates="resumes")
    matches = relationship("JobMatch", back_populates="resume")

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, index=True)
    recruiter_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, nullable=True)  # List of required skills
    experience_level = Column(String, nullable=True)  # "entry", "mid", "senior"
    salary_range = Column(String, nullable=True)
    location = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    recruiter = relationship("User", back_populates="jobs")
    matches = relationship("JobMatch", back_populates="job")
    decisions = relationship("HiringDecision", back_populates="job")

class JobMatch(Base):
    __tablename__ = "job_matches"
    
    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=False)
    match_score = Column(Float, nullable=False)  # 0-100
    matched_skills = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    bias_risk_level = Column(String, nullable=True)  # "Low", "Medium", "High"
    bias_findings = Column(JSON, nullable=True)
    projects_verified = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="matches")
    resume = relationship("Resume", back_populates="matches")

class HiringDecision(Base):
    __tablename__ = "hiring_decisions"
    
    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False)  # "applied", "shortlisted", "rejected", "offered", "hired"
    match_score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="decisions")
    recruiter = relationship("User", back_populates="decisions")
