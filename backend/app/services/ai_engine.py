from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from app.services.bias_checker import detect_bias
import re

# Lazy load model
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            print(f"Warning: Could not load SentenceTransformer model: {e}")
            print("Using fallback simple matching...")
            _model = None
    return _model

SKILLS = ["Python","Machine Learning","NLP","SQL","Docker","AWS"]

def extract_years_of_experience(text):
    """Extract years of experience from resume text"""
    patterns = [
        r'(\d+)\s*(?:\+)?\s*years?\s+of\s+(?:professional\s+)?experience',
        r'experience[:\s]+(\d+)\s*(?:\+)?\s*years?',
        r'(\d+)\s*(?:\+)?\s*years?\s+(?:working|experience)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                return int(match.group(1))
            except:
                pass
    
    # Default heuristic: count job entries
    job_keywords = ['worked', 'software engineer', 'developer', 'manager', 'lead', 'senior', 'junior']
    count = sum(1 for kw in job_keywords if kw.lower() in text.lower())
    return max(1, count // 2)

def simple_match_score(resume, jd):
    """Simple fallback matching without ML model"""
    resume_lower = resume.lower()
    jd_lower = jd.lower()
    
    # Count skill matches
    matched = sum(1 for skill in SKILLS if skill.lower() in resume_lower and skill.lower() in jd_lower)
    total = len(SKILLS)
    
    # Count keyword overlap
    resume_words = set(resume_lower.split())
    jd_words = set(jd_lower.split())
    overlap = len(resume_words & jd_words) / len(resume_words | jd_words) if (resume_words | jd_words) else 0
    
    score = (matched / total * 50) + (overlap * 50)
    return min(100, score)

def calculate_match(resume, jd):
    try:
        model = get_model()
        if model:
            emb = model.encode([resume, jd])
            score = cosine_similarity([emb[0]],[emb[1]])[0][0]
            score = round(float(score) * 100, 2)
        else:
            score = simple_match_score(resume, jd)
    except Exception as e:
        print(f"Error calculating match: {e}")
        score = simple_match_score(resume, jd)
    
    found = [s for s in SKILLS if s.lower() in resume.lower()]
    missing = [s for s in SKILLS if s not in found]
    years = extract_years_of_experience(resume)
    
    return {
        "match_score": score,
        "matched_skills": found,
        "missing_skills": missing,
        "experience_years": years,
        "bias_flags": detect_bias(resume),
        "recommendations": [f"Add project in {s}" for s in missing],
        "explanation": "AI semantic and skill-based evaluation completed."
    }

def rank_resumes(resumes, jd):
    res = []
    for name, text in resumes:
        r = calculate_match(text, jd)
        r["candidate"] = name
        res.append(r)
    return sorted(res, key=lambda x: x["match_score"], reverse=True)
