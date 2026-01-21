# Technology Stack & Architecture

## 📊 Complete Tech Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   AI Hiring SaaS Platform                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              FRONTEND (React + Vite)                 │   │
│  │  http://localhost:5173                              │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • React 18 - Component-based UI                     │   │
│  │ • Vite - Fast build tool & dev server              │   │
│  │ • JavaScript ES6+ - Modern syntax                  │   │
│  │ • CSS3 - Responsive styling                        │   │
│  │ • Fetch API - HTTP requests                        │   │
│  │ • localStorage - Client session storage             │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API GATEWAY (CORS)                      │   │
│  │         http://127.0.0.1:8000                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              BACKEND (FastAPI)                       │   │
│  │         Python 3.13 + Uvicorn                        │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │           API ROUTERS                       │    │   │
│  │  ├─────────────────────────────────────────────┤    │   │
│  │  │ • /auth - Login, Register, JWT tokens      │    │   │
│  │  │ • /recruiter - Job & candidate management  │    │   │
│  │  │ • /candidate - Resume & matching           │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                      ↓                              │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │           AI SERVICES                       │    │   │
│  │  ├─────────────────────────────────────────────┤    │   │
│  │  │ • ai_engine.py - Semantic matching         │    │   │
│  │  │ • bias_checker.py - Bias detection         │    │   │
│  │  │ • github_verifier.py - GitHub validation   │    │   │
│  │  │ • pdf_parser.py - Resume parsing           │    │   │
│  │  │ • resume_service.py - File handling        │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                      ↓                              │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │        AUTHENTICATION & SECURITY            │    │   │
│  │  ├─────────────────────────────────────────────┤    │   │
│  │  │ • JWT Tokens - Stateless auth              │    │   │
│  │  │ • Argon2 - Password hashing                │    │   │
│  │  │ • Role-based access control                │    │   │
│  │  │ • CORS configuration                       │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  │                      ↓                              │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │           ORM & DATABASE                    │    │   │
│  │  ├─────────────────────────────────────────────┤    │   │
│  │  │ • SQLAlchemy - Object-Relational Mapper    │    │   │
│  │  │ • Pydantic - Data validation               │    │   │
│  │  │ • SQLite (dev) → PostgreSQL (prod)        │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↕                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              DATABASE                               │   │
│  │         hiring_saas.db (SQLite)                      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • Users (Recruiters & Candidates)                   │   │
│  │ • Jobs (Job postings)                               │   │
│  │ • Resumes (Uploaded files & extracted data)         │   │
│  │ • JobMatches (Scoring & analysis results)           │   │
│  │ • HiringDecisions (Hiring pipeline)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AI/ML LIBRARIES                         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • Sentence Transformers - Semantic matching        │   │
│  │ • Scikit-learn - Machine learning utilities        │   │
│  │ • PDFPlumber - PDF text extraction                 │   │
│  │ • Regex - Pattern matching for skills             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              EXTERNAL SERVICES                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • GitHub API - Project verification                │   │
│  │ • Email (future) - Notifications                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔙 Backend Architecture

### Directory Structure
```
backend/
├── app/
│   ├── api/                    # REST API endpoints
│   │   ├── auth.py            # 150 lines - Auth endpoints
│   │   ├── recruiter.py       # 350+ lines - Job management
│   │   └── candidate.py       # 300+ lines - Resume matching
│   │
│   ├── services/              # Business logic
│   │   ├── ai_engine.py       # Semantic matching algorithm
│   │   ├── bias_checker.py    # Bias detection logic
│   │   ├── github_verifier.py # GitHub API integration
│   │   ├── pdf_parser.py      # PDF text extraction
│   │   └── resume_service.py  # Resume file handling
│   │
│   ├── models.py              # 180 lines - Database models
│   │   ├── User
│   │   ├── Resume
│   │   ├── Job
│   │   ├── JobMatch
│   │   └── HiringDecision
│   │
│   ├── schemas.py             # 120 lines - Pydantic schemas
│   ├── auth.py                # 100 lines - JWT & password utils
│   ├── database.py            # 25 lines - DB configuration
│   ├── logging_config.py      # Logging setup
│   └── main.py                # 50 lines - FastAPI app
│
├── storage/
│   └── resumes/               # Uploaded PDF/DOC files
│
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── hiring_saas.db            # SQLite database
```

### Key Files & Lines of Code

| File | Lines | Purpose |
|------|-------|---------|
| `app/models.py` | ~180 | 5 SQLAlchemy models |
| `app/schemas.py` | ~120 | Pydantic validation |
| `app/api/recruiter.py` | ~350 | Job endpoints |
| `app/api/candidate.py` | ~300 | Resume endpoints |
| `app/api/auth.py` | ~150 | Auth endpoints |
| `app/services/ai_engine.py` | ~200 | Matching algorithm |
| `app/auth.py` | ~100 | JWT & hashing |

### Dependency Injection Flow

```
HTTP Request
    ↓
FastAPI receives request
    ↓
Pydantic validates input
    ↓
Router calls handler function
    ↓
Handler requests dependencies:
    - get_current_user (JWT validation)
    - get_current_recruiter (role check)
    - get_db (database session)
    ↓
Dependencies execute
    ↓
Handler logic runs
    ↓
Service functions execute (ai_engine, bias_checker, etc.)
    ↓
Database queries execute
    ↓
Response returned to client
```

---

## 🎨 Frontend Architecture

### Component Tree
```
App (Root)
├── Navbar
│   ├── Logo & Home button
│   ├── Navigation buttons
│   ├── Login/Register button (if logged out)
│   └── User profile & Logout button (if logged in)
│
├── AuthModal
│   ├── Login Tab
│   │   └── Email, Password inputs
│   └── Register Tab
│       ├── Email, Username, Password inputs
│       ├── Full Name input
│       ├── Company input (for recruiters)
│       └── Role selector dropdown
│
├── HomePage
│   ├── Welcome banner
│   ├── Feature cards
│   └── Browse as Guest buttons
│
├── CandidatePortal
│   ├── Job Listings Section
│   │   └─ Job cards (clickable to select)
│   ├── Resume Upload Section
│   │   ├─ File input
│   │   └─ Analyze button
│   └── Results Section
│       ├─ Match score (big display)
│       ├─ Matched skills
│       ├─ Missing skills
│       ├─ Bias risk level
│       └─ GitHub projects verified
│
└── RecruiterDashboard
    ├── Tabs: Jobs | Upload | Candidates | Analytics
    │
    ├── Jobs Tab
    │   ├─ Create Job Form
    │   └─ Jobs List with Edit/Delete buttons
    │
    ├── Upload Resumes Tab
    │   ├─ Job Selection Dropdown (NEW!)
    │   ├─ Multiple file input
    │   ├─ Upload button
    │   └─ Results rankings table
    │
    ├── Candidates Tab
    │   └─ Candidates list by job
    │
    └── Analytics Tab
        ├─ Stats cards
        ├─ Hiring funnel
        └─ Top skills chart
```

### State Management Pattern

```
App Component (React State)
├── currentPage: "home" | "candidate" | "recruiter"
├── isLoggedIn: boolean
├── username: string
├── userRole: "recruiter" | "candidate"
├── isGuest: boolean
├── authModalOpen: boolean
│
└─ Props passed down to:
   ├── Navbar (read state)
   ├── AuthModal (read state, update via callbacks)
   ├── HomePage (read state, update via callbacks)
   ├── CandidatePortal (read state, update via callbacks)
   └── RecruiterDashboard (read state, update via callbacks)
```

### API Call Flow (Frontend)

```
User action (click button)
    ↓
Event handler triggers
    ↓
setState updates UI (show loading)
    ↓
fetch() to backend API
    ├─ Include token in headers:
    │  Authorization: Bearer {token}
    ├─ Include body/data
    └─ Handle response
    ↓
Backend processes
    ↓
Response received
    ↓
setState with results
    ↓
UI updates
    ↓
Show results to user
```

---

## 🤖 AI & ML Components

### 1. Semantic Matching (Sentence Transformers)

```python
from sentence_transformers import SentenceTransformer, util

# Initialize model (downloads ~500MB on first run)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Encode job and resume
job_embedding = model.encode(job_description)
resume_embedding = model.encode(resume_text)

# Calculate similarity (0-1 scale)
similarity = util.pytorch_cos_sim(job_embedding, resume_embedding)
match_score = int(similarity * 100)  # 0-100
```

**Why this model?**
- Fast & lightweight (23MB)
- Good accuracy for job-resume matching
- Multiple semantic tasks supported

### 2. Skill Extraction

```python
import re

# Skill database
SKILLS_DB = [
    'Python', 'JavaScript', 'React', 'FastAPI', 'Django',
    'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
    # ... 100+ skills
]

# Extract from resume text
found_skills = []
for skill in SKILLS_DB:
    if re.search(rf'\b{skill}\b', resume_text, re.IGNORECASE):
        found_skills.append(skill)
```

### 3. Bias Detection

```python
# Bias patterns database
BIAS_PATTERNS = {
    'gender': ['aggressive', 'nurturing', 'energetic', ...],
    'age': ['digital native', 'young energy', 'tech-savvy', ...],
    'disability': ['able-bodied', 'physically fit', ...],
}

# Scan job description
bias_findings = []
for category, keywords in BIAS_PATTERNS.items():
    for keyword in keywords:
        if keyword.lower() in job_description.lower():
            bias_findings.append(f"Found {category} bias: '{keyword}'")

# Calculate risk level
risk_level = len(bias_findings)
# "Low" (0-2), "Medium" (3-5), "High" (5+)
```

### 4. GitHub Verification

```python
import requests

# Extract GitHub URL from resume
github_url_pattern = r'github\.com/[\w-]+'
matches = re.findall(github_url_pattern, resume_text)

for github_url in matches:
    username = github_url.split('/')[-1]
    
    # Query GitHub API
    response = requests.get(f'https://api.github.com/users/{username}')
    if response.status_code == 200:
        user_data = response.json()
        projects_verified += 1
        # Get public repos, stars, languages, etc.
```

---

## 🔐 Security Implementation

### Password Hashing Flow

```
Plain Password: "MyPassword123!"
    ↓
Argon2 Algorithm
    ├─ Salt: random bytes
    ├─ Iterations: 2
    ├─ Memory: 65536 KB
    ├─ Parallelism: 4
    └─ Output: hash
    ↓
Hashed: "$argon2id$v=19$m=65536,t=2,p=4$..."
    ↓
Stored in database (NEVER plaintext!)
```

### JWT Token Flow

```
User logs in
    ↓
Backend verifies credentials
    ↓
Create JWT payload:
{
  "sub": "user-id-uuid",
  "user_type": "recruiter",
  "exp": 1705593600,
  "iat": 1705590000
}
    ↓
Sign with SECRET_KEY using HS256
    ↓
Return token: "eyJhbGci..."
    ↓
Client stores in localStorage
    ↓
Every API request:
Header: Authorization: Bearer eyJhbGci...
    ↓
Backend verifies:
- Signature valid?
- Not expired?
- User still exists?
    ↓
Grant/Deny access
```

---

## 📊 Database Relationships

```
User (Recruiter)
    ├─ Posted Jobs (1 to Many)
    │   └─ Job
    │       ├─ Resumes matched (Many to Many via JobMatch)
    │       └─ Candidates (via JobMatch + Resume)
    └─ Hiring Decisions made (1 to Many)

User (Candidate)
    ├─ Resumes (1 to Many)
    │   └─ Resume
    │       └─ Job Matches (Many via JobMatch)
    └─ Applied to Jobs (via HiringDecision)

Job (by Recruiter)
    ├─ Matched Resumes (Many via JobMatch)
    └─ Hiring Decisions (1 to Many)

JobMatch
    ├─ Job
    ├─ Resume
    └─ Analysis Results

HiringDecision
    ├─ Job
    ├─ Candidate (User)
    ├─ Recruiter (User who made decision)
    └─ Status in pipeline
```

---

## 📦 Dependencies Breakdown

### Backend (Python)

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | latest | Web framework |
| uvicorn | latest | ASGI server |
| sqlalchemy | latest | ORM |
| pydantic | latest | Data validation |
| sentence-transformers | latest | AI/ML matching |
| scikit-learn | latest | ML utilities |
| pdfplumber | latest | PDF parsing |
| python-jose | latest | JWT tokens |
| passlib | latest | Password hashing |
| argon2-cffi | latest | Argon2 algorithm |
| python-email-validator | latest | Email validation |
| pydantic-settings | latest | Config management |

**Total Size:** ~500MB (mostly ML models)

### Frontend (Node.js)

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI framework |
| react-dom | 18.2.0 | React DOM |
| vite | 5.4.21 | Build tool |
| @vitejs/plugin-react | 4.7.0 | React support |

**Total Size:** ~200MB (includes node_modules)

---

## 🚀 Deployment Architecture

### Development
```
localhost:5173 (Frontend Vite)
       ↕
localhost:8000 (Backend FastAPI)
       ↕
hiring_saas.db (Local SQLite)
```

### Production
```
CDN / AWS CloudFront (Frontend)
    └─ Serves compiled React app
       
AWS ECS / Heroku (Backend)
    ├─ Multiple instances (load balanced)
    ├─ Gunicorn/Uvicorn workers
    └─ Auto-scaling

AWS RDS (Database)
    └─ PostgreSQL (replicated, backups)

AWS S3 (File Storage)
    └─ Uploaded resumes (encrypted)
```

---

## 📈 Performance Considerations

### Optimizations Done
- ✅ Lazy loading components
- ✅ Resume processing parallelized
- ✅ Cached ML models
- ✅ Database indexing on key fields
- ✅ Async/await in backend
- ✅ Vite fast HMR in development

### Future Optimizations
- Add Redis caching for frequent queries
- Implement job queue (Celery) for heavy processing
- Enable database query pagination
- Add frontend code splitting

---

## 🔍 Monitoring & Logging

### Backend Logging
```python
import logging

logger = logging.getLogger(__name__)

# Example logs:
logger.info(f"User {user_id} logged in")
logger.error(f"PDF parsing failed: {error}")
logger.debug(f"Match score: {score}")
```

**Log Levels:**
- DEBUG: Development info
- INFO: Important events
- WARNING: Potential issues
- ERROR: Failures that occurred

---

## 📚 Additional Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com
- **React Docs:** https://react.dev
- **Sentence Transformers:** https://www.sbert.net
- **SQLAlchemy:** https://sqlalchemy.org
- **Vite:** https://vitejs.dev

---

**Last Updated:** January 2026  
**Version:** 1.0.0
