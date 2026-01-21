# Feature Documentation - AI Hiring SaaS Platform

## 🎯 Platform Overview

This is a **full-stack AI-powered recruitment SaaS application** that helps recruiters automate candidate screening and helps candidates find better job matches using artificial intelligence.

---

## 🔍 How It Works

### Candidate Flow

```
1. REGISTER
   ↓
2. LOGIN
   ↓
3. UPLOAD RESUME
   ↓
4. SELECT JOB
   ↓
5. GET AI ANALYSIS
   ├─ Match Score (0-100%)
   ├─ Matched Skills
   ├─ Missing Skills
   ├─ Bias Risk Level
   └─ GitHub Verification
   ↓
6. APPLY FOR JOB
   ↓
7. RECRUITER REVIEWS
```

### Recruiter Flow

```
1. REGISTER
   ↓
2. LOGIN
   ↓
3. CREATE JOB POSTING
   ├─ Title
   ├─ Description
   ├─ Required Skills
   ├─ Experience Level
   ├─ Salary Range
   └─ Location
   ↓
4. SELECT JOB FROM DROPDOWN
   ↓
5. UPLOAD MULTIPLE RESUMES
   ↓
6. AI RANKS CANDIDATES
   ├─ Calculates match scores
   ├─ Extracts skills
   ├─ Detects bias
   └─ Verifies GitHub
   ↓
7. VIEW CANDIDATES LIST
   ├─ Sorted by match score
   ├─ See matched/missing skills
   └─ View bias risk
   ↓
8. MAKE HIRING DECISIONS
   ├─ Shortlist candidates
   ├─ Reject candidates
   ├─ Send offers
   └─ Track hired status
   ↓
9. VIEW ANALYTICS DASHBOARD
   ├─ Total candidates processed
   ├─ Average match score
   ├─ Hiring funnel
   └─ Top skills in demand
```

---

## 📊 Tech Stack Breakdown

### Why Each Technology?

#### **Backend - FastAPI**
- ✅ Modern, fast (near Node.js performance)
- ✅ Built-in async/await for concurrent requests
- ✅ Automatic API documentation (Swagger UI)
- ✅ Strong type hints with Pydantic validation
- ✅ Easy to deploy with Uvicorn/Gunicorn

#### **Frontend - React + Vite**
- ✅ React: Component-based UI, large ecosystem
- ✅ Vite: 10x faster than Webpack, instant HMR
- ✅ Perfect for real-time updates during analysis

#### **Database - SQLAlchemy + SQLite**
- ✅ SQLAlchemy: ORM that works with any database
- ✅ SQLite: Perfect for development, upgrade to PostgreSQL for production
- ✅ Automatic schema creation from models

#### **AI/ML - Sentence Transformers**
- ✅ Uses pre-trained BERT models
- ✅ Semantic understanding, not just keyword matching
- ✅ Embeddings for intelligent similarity calculation
- ✅ Better than simple string comparison

#### **Authentication - JWT + Argon2**
- ✅ JWT: Stateless auth, scalable across servers
- ✅ Argon2: NIST-recommended password hashing algorithm
- ✅ No session storage needed

---

## 🧠 AI/ML Implementation Details

### 1. Resume Parsing & Skill Extraction

**Process:**
```
PDF/DOC File
    ↓
PDFPlumber (Extract Text)
    ↓
Keyword Matching + NLP
    ↓
Skills List
(e.g., ["Python", "React", "AWS"])
```

**Libraries Used:**
- `pdfplumber` - Extracts text from PDFs
- `re` (regex) - Pattern matching for skills
- `sentence-transformers` - For semantic understanding

### 2. Job-Resume Matching

**Algorithm:**
```
Job Description
    ↓
Tokenize & Embed (Sentence Transformers)
    ↓
Resume Skills
    ↓
Tokenize & Embed
    ↓
Calculate Cosine Similarity
    ↓
Match Score (0-100%)
```

**Example:**
```
Job wants: "Python developer"
Resume has: "Experienced Python programmer"

Without AI: 0% match (exact string doesn't match)
With AI: 95% match (semantic similarity understood)
```

### 3. Bias Detection

**Checks for:**
- 👧 Gender bias words (aggressive, nurturing, etc.)
- 👵 Age bias (digital native, young energy, etc.)
- 🏳️ Diversity indicators (balance evaluation)
- 💼 Discriminatory language

**Output:**
```json
{
  "bias_risk_level": "Low/Medium/High",
  "bias_findings": [
    "Found age-related bias: 'digital native'",
    "Found potential gender bias: 'nurturing'"
  ]
}
```

### 4. GitHub Verification

**Process:**
```
Extract GitHub URL from resume
    ↓
Query GitHub API
    ↓
Verify repository exists
    ↓
Count:
  - Stars
  - Forks
  - Languages
  - Contributions
    ↓
Return verified status
```

---

## 🔐 Security Architecture

### Authentication Flow

```
1. User registers with password
   ↓
2. Password hashed with Argon2
   ↓
3. Stored in database (never plaintext)
   ↓
4. User logs in with email + password
   ↓
5. Backend verifies:
   - Email exists
   - Password matches hash
   ↓
6. Generate JWT token
   ↓
7. Token stored in localStorage
   ↓
8. Every API request includes token in header:
   Authorization: Bearer {token}
   ↓
9. Backend verifies token validity and expiration
   ↓
10. Grant access or return 401 Unauthorized
```

### Data Security

- ✅ **Password Hashing**: Argon2 (NIST recommended)
- ✅ **JWT Tokens**: 30-minute expiration
- ✅ **CORS**: Cross-origin requests properly configured
- ✅ **Input Validation**: Pydantic schemas on all inputs
- ✅ **SQL Injection Prevention**: SQLAlchemy parameterized queries
- ✅ **Role-Based Access**: Recruiters/candidates can only see their data

---

## 📈 Database Schema

### User Model
```python
User {
  id: UUID (unique)
  email: string (unique)
  username: string (unique)
  hashed_password: string (Argon2)
  user_type: "recruiter" | "candidate"
  full_name: string
  company: string (for recruiters)
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### Job Model
```python
Job {
  id: UUID
  recruiter_id: UUID (links to User)
  title: string
  description: text
  required_skills: ["Python", "React", ...]
  experience_level: "junior" | "mid" | "senior"
  salary_range: string
  location: string
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### Resume Model
```python
Resume {
  id: UUID
  candidate_id: UUID (links to User)
  filename: string
  file_path: string
  extracted_text: text
  skills: ["Python", "FastAPI", ...]
  experience_years: integer
  github_projects: [
    {
      url: string,
      stars: integer,
      verified: boolean
    }
  ]
  is_primary: boolean
  created_at: timestamp
}
```

### JobMatch Model
```python
JobMatch {
  id: UUID
  job_id: UUID (links to Job)
  resume_id: UUID (links to Resume)
  match_score: 0-100
  matched_skills: ["Python", "React"]
  missing_skills: ["Docker", "Kubernetes"]
  bias_risk_level: "Low" | "Medium" | "High"
  bias_findings: ["Found age bias: digital native"]
  projects_verified: integer
  created_at: timestamp
}
```

### HiringDecision Model
```python
HiringDecision {
  id: UUID
  job_id: UUID (links to Job)
  candidate_id: UUID (links to User)
  status: "applied" | "shortlisted" | "rejected" | "offered" | "hired"
  match_score: 0-100
  feedback: text
  created_by: UUID (recruiter)
  created_at: timestamp
  updated_at: timestamp
}
```

---

## 🚀 Key Features Explained

### Feature 1: Resume Upload & Analysis
**What it does:**
- Accept PDF/DOC/TXT files
- Parse text content
- Extract skills automatically
- Calculate experience level

**Why it's useful:**
- Saves recruiters hours manually reviewing resumes
- Standardizes skill extraction
- Prevents bias in initial review

### Feature 2: Job Matching
**What it does:**
- Calculate match score between resume and job
- Identify matched skills
- Identify missing skills
- Use semantic AI (not just keywords)

**Why it's useful:**
- Find the best candidates automatically
- Speed up screening process
- Make data-driven decisions

### Feature 3: Bias Detection
**What it does:**
- Scan job descriptions for biased language
- Identify discriminatory patterns
- Rate bias risk level

**Why it's useful:**
- Legal compliance (EEOC requirements)
- Fairer hiring process
- Diverse candidate pool

### Feature 4: Job Management
**What it does:**
- Create detailed job postings
- Edit job details
- Delete jobs
- Track all posted jobs

**Why it's useful:**
- Organize multiple job openings
- Update requirements as needed
- Clean up old postings

### Feature 5: Bulk Resume Processing
**What it does:**
- Upload 10+ resumes at once
- Process all in parallel
- Get ranked list by match score

**Why it's useful:**
- Process candidates faster
- Shortlist top matches automatically
- Save hours of manual review

### Feature 6: Hiring Analytics
**What it does:**
- Track total jobs posted
- Monitor candidates processed
- Show average match score
- Display hiring funnel
- List top skills in demand

**Why it's useful:**
- Make data-driven hiring decisions
- Identify skill gaps
- Optimize hiring process
- Measure recruiter effectiveness

---

## 💡 AI Algorithms Explained

### Semantic Similarity (Sentence Transformers)

**Simple approach (❌ doesn't work):**
```python
job_skills = ["Python", "JavaScript"]
resume_text = "I know C++ and Go"
match_score = 0  # No keyword match!
```

**AI approach (✅ works):**
```python
# Sentence Transformers converts text to 384-dimensional vectors
job_embedding = encode("Need Python developer")
# [0.2, -0.1, 0.8, ..., 0.3]

resume_embedding = encode("I'm a Python programmer")
# [0.19, -0.09, 0.79, ..., 0.31]

# Cosine similarity between vectors
match_score = cosine_similarity(job_embedding, resume_embedding)
# 0.95 (95% similar!)
```

**Why it works:**
- Understands meaning, not just strings
- "Python developer" matches "Python programmer"
- Handles synonyms and variations
- Context-aware matching

### Keyword Extraction

**Process:**
```
Resume text: "Worked with Python, FastAPI, React for 5 years"
         ↓
Regex pattern matching: r"(?i)(python|javascript|react|django|...)"
         ↓
Found matches: ["Python", "React"]
         ↓
Additional NLP: Extract experience from context
```

---

## 🔗 API Flow Examples

### Example 1: User Registration

```
Client (Frontend)
    ↓
POST /auth/register
{
  email: "john@example.com",
  username: "johndoe",
  password: "SecurePass123",
  full_name: "John Doe",
  user_type: "candidate"
}
    ↓
Backend (FastAPI)
    ├─ Validate email format
    ├─ Check if email already exists
    ├─ Hash password with Argon2
    ├─ Create user in database
    └─ Generate JWT token
    ↓
Response:
{
  access_token: "eyJhbGc...",
  token_type: "bearer",
  user: {
    id: "uuid-123",
    email: "john@example.com",
    username: "johndoe",
    user_type: "candidate"
  }
}
    ↓
Client stores token in localStorage
```

### Example 2: Resume Analysis

```
Client uploads resume + selects job
    ↓
POST /candidate/match-resume
FormData:
- resume (file)
- job_description (text)
    ↓
Backend processes:
1. Parse PDF/text
2. Extract skills
3. Embed resume and job
4. Calculate similarity
5. Detect bias
6. Verify GitHub (if found)
    ↓
Response:
{
  match_score: 87,
  matched_skills: ["Python", "React"],
  missing_skills: ["Docker"],
  bias_risk_level: "Low",
  github_projects: [{verified: true}]
}
    ↓
Frontend displays results
```

### Example 3: Recruiter Rankings

```
Recruiter selects job + uploads resumes
    ↓
POST /recruiter/jobs/{job_id}/rank-candidates
FormData:
- resumes (multiple files)
    ↓
Backend:
1. Process each resume (parallel)
2. Extract skills from all
3. Match against job description
4. Calculate scores for each
5. Rank by score
6. Return sorted list
    ↓
Response:
{
  total_resumes: 5,
  results: [
    {filename: "john.pdf", match_score: 95, ...},
    {filename: "jane.pdf", match_score: 88, ...},
    {filename: "bob.pdf", match_score: 72, ...},
    ...
  ]
}
    ↓
Frontend shows candidates ranked by match
```

---

## 📱 User Interface Flow

### Candidate Portal
```
Home Page
  ├─ Login/Register button
  └─ Features overview
      ↓
  Login/Register Modal
      ↓
  Candidate Portal
  ├─ Available Jobs list
  │  └─ Click to select
  ├─ Resume upload area
  ├─ Analyze button
  └─ Results section
      ├─ Match score (big number)
      ├─ Matched skills (green badges)
      ├─ Missing skills (gray badges)
      ├─ Bias risk (yellow/red)
      └─ GitHub projects (verified checkmarks)
```

### Recruiter Dashboard
```
Recruiter Dashboard Tabs:

1. 📋 Jobs Tab
   ├─ Create Job Form
   │  ├─ Job Title
   │  ├─ Description
   │  ├─ Required Skills
   │  ├─ Experience Level
   │  ├─ Salary Range
   │  └─ Location
   └─ Jobs List
      ├─ Job cards
      ├─ "Upload Resumes" button
      └─ "Delete Job" button

2. 📤 Upload Resumes Tab
   ├─ Job Selection Dropdown
   ├─ Multiple file input
   ├─ Upload button
   └─ Results table
      ├─ Ranking by score
      ├─ Match percentage
      ├─ Skills match
      └─ Bias risk level

3. 👥 Candidates Tab
   └─ List of all candidates
      ├─ Resume ID
      ├─ Match score
      ├─ Matched skills
      └─ Missing skills

4. 📊 Analytics Tab
   ├─ Total jobs (card)
   ├─ Total candidates (card)
   ├─ Average match score (card)
   ├─ Bias alerts (card)
   ├─ Hiring Funnel
   │  ├─ Applied
   │  ├─ Shortlisted
   │  ├─ Rejected
   │  ├─ Offered
   │  └─ Hired
   └─ Top Skills chart
      └─ Most demanded skills
```

---

## 🎓 Learning & Understanding

### If you're new to this concept:

1. **Resume Matching**
   - It's like a dating app for jobs
   - Each resume gets scored (0-100) against job requirements
   - Higher score = better match

2. **Semantic AI**
   - Computer understands meaning, not just words
   - "Python developer" = "Python programmer" (same meaning)
   - This makes matching more accurate

3. **Bias Detection**
   - Some words in job ads can discourage certain groups
   - System flags potentially problematic language
   - Helps ensure fair hiring

4. **GitHub Verification**
   - Proves candidates actually coded what they claim
   - Pulls real data from their GitHub profile
   - Shows projects, stars, contributions

---

## 🚀 What Makes This Special

### vs. Traditional Recruiting
- ❌ Manual resume review → ✅ AI-powered analysis
- ❌ Hours of reading → ✅ Ranked list in seconds
- ❌ Biased hiring → ✅ Bias detection built-in
- ❌ Fake credentials → ✅ GitHub verification
- ❌ Gut feelings → ✅ Data-driven decisions

### vs. Other ATS Tools
- ✅ Open source (you own the code)
- ✅ No subscription fees
- ✅ Deploy on your own servers
- ✅ Customize for your needs
- ✅ Full transparency

---

## 📞 Need Help?

See main README.md for:
- Installation steps
- Running the app
- API documentation
- Troubleshooting

---

**Last Updated:** January 2026  
**Version:** 1.0.0
