BIAS = ["male","female","iit","nit","young","old"]

def detect_bias(text):
    return [b for b in BIAS if b in text.lower()]

def check_bias(jd_text, resume_text):
    """Check for bias in job description against resume"""
    jd_bias = detect_bias(jd_text)
    resume_bias = detect_bias(resume_text)
    
    risk_level = "Low"
    if len(jd_bias) >= 2:
        risk_level = "High"
    elif len(jd_bias) >= 1:
        risk_level = "Medium"
    
    return {
        "risk_level": risk_level,
        "findings": [f"Found bias indicator: {b}" for b in jd_bias] if jd_bias else ["No bias indicators detected"],
        "recommendations": ["Use inclusive language", "Remove unnecessary requirements"] if jd_bias else ["Job description looks fair"],
        "overall_score": max(50, 100 - (len(jd_bias) * 20))
    }
