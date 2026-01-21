# AI Hiring SaaS Platform

An intelligent, AI-powered recruitment platform that uses machine learning to analyze resumes, match candidates to jobs, detect bias in hiring processes, and verify technical credentials.

## 🎯 Overview

This full-stack SaaS application revolutionizes recruitment by:
- **Automating resume analysis** with AI-powered NLP
- **Matching candidates to jobs** using semantic similarity
- **Detecting hiring bias** to ensure fair recruitment
- **Verifying GitHub profiles** to validate technical experience
- **Providing real-time analytics** for data-driven hiring decisions

## ✨ Key Features

### 🔐 Authentication & User Management
- Secure user registration and login with JWT tokens
- Separate portals for recruiters and candidates
- Role-based access control
- Password hashing with Argon2
- Session management with localStorage

### 👥 Candidate Portal
- **Resume Upload** - Upload and manage multiple resumes (PDF, DOC, TXT)
- **Resume Analysis** - AI-powered resume parsing and skill extraction
- **Job Matching** - Find matching jobs based on extracted skills
- **Match Score** - View compatibility percentage with job requirements
- **Bias Risk Assessment** - See potential bias in job descriptions
- **GitHub Verification** - Validate GitHub projects and contributions
- **Apply to Jobs** - Submit applications directly through the platform

### 💼 Recruiter Dashboard
- **Job Management**
  - Create detailed job postings with skills, salary, location
  - Edit job details
  - Delete jobs
  - View all posted jobs
- **Resume Processing**
  - Select job from dropdown
  - Bulk upload multiple resumes
  - AI-powered ranking by match score
- **Candidate Management**
  - View all candidates for each job
  - Track candidate match scores
  - Review matched and missing skills
  - Access candidate information
- **Hiring Pipeline**
  - Track candidates through workflow (Applied → Shortlisted → Rejected/Offered → Hired)
  - Add feedback and notes
  - Make hiring decisions
- **Analytics Dashboard**
  - Total jobs posted
  - Total candidates processed
  - Average match score
  - Hiring funnel metrics
  - Top skills in demand
  - Bias alert tracking

### 🤖 AI & Analytics Features
- **Semantic Matching** - Uses Sentence Transformers for intelligent job-resume matching
- **Skill Extraction** - Automatic identification of candidate skills from resumes
- **Bias Detection** - Identifies potential discriminatory language in job descriptions
- **Experience Scoring** - Calculates years of relevant experience
- **GitHub Analysis** - Verifies and analyzes GitHub projects
- **Real-time Progress** - WebSocket updates during analysis

### 📊 Data & Persistence
- SQLite database (easily upgradeable to PostgreSQL)
- Persistent storage of users, jobs, resumes, and decisions
- Full audit trail of hiring decisions
- Resume file storage on server

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Modern async web framework |
| **Python 3.13** | Core language |
| **SQLAlchemy** | ORM for database |
| **Pydantic** | Data validation |
| **Sentence Transformers** | Semantic similarity & NLP |
| **Scikit-learn** | Machine learning utilities |
| **PDFPlumber** | PDF text extraction |
| **PyJWT** | JWT authentication |
| **Passlib + Argon2** | Password hashing |
| **Uvicorn** | ASGI server |
| **SQLite** | Database |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Fast build tool |
| **JavaScript (ES6+)** | Core language |
| **CSS3** | Styling |
| **Fetch API** | HTTP requests |
| **localStorage** | Client-side session storage |

### DevOps & Tools
| Tool | Usage |
|------|-------|
| **Git** | Version control |
| **npm** | Node package manager |
| **pip** | Python package manager |

## 📁 Project Structure

```
AI_Hiring_SaaS_Full_Project/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py              # Login/Register endpoints
│   │   │   ├── recruiter.py         # Job & candidate management
│   │   │   └── candidate.py         # Resume & job matching
│   │   ├── services/
│   │   │   ├── ai_engine.py         # Semantic matching logic
│   │   │   ├── bias_checker.py      # Bias detection
│   │   │   ├── github_verifier.py   # GitHub verification
│   │   │   ├── pdf_parser.py        # PDF extraction
│   │   │   └── resume_service.py    # Resume handling
│   │   ├── models.py                # SQLAlchemy models
│   │   ├── schemas.py               # Pydantic schemas
│   │   ├── auth.py                  # JWT & password utils
│   │   ├── database.py              # DB configuration
│   │   ├── logging_config.py        # Logging setup
│   │   └── main.py                  # FastAPI app
│   ├── storage/
│   │   └── resumes/                 # Uploaded resumes
│   ├── requirements.txt             # Python dependencies
│   └── start_backend.bat            # Windows startup script
│
├── frontend/
│   └── ai-hiring-ui/
│       ├── src/
│       │   ├── components/
│       │   │   ├── AuthModal.jsx    # Login/Register form
│       │   │   ├── Navbar.jsx       # Navigation & user menu
│       │   │   └── *.css            # Component styles
│       │   ├── pages/
│       │   │   ├── HomePage.jsx     # Landing page
│       │   │   ├── CandidatePortal.jsx    # Resume analysis
│       │   │   ├── RecruiterDashboard.jsx # Job management
│       │   │   └── *.css            # Page styles
│       │   ├── App.jsx              # Root component
│       │   ├── App.css              # Global styles
│       │   ├── index.css            # Base styles
│       │   └── main.jsx             # Entry point
│       ├── index.html               # HTML template
│       ├── package.json             # npm dependencies
│       ├── vite.config.js           # Vite configuration
│       └── node_modules/            # Installed packages
│
├── README.md                        # This file
├── QUICKSTART.md                    # Quick setup guide
├── DEPLOYMENT.md                    # Production deployment
└── .git/                           # Git repository

```

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/tanukhatiyan/AI-Powered-Hiring-SaaS-Platform.git
cd AI_Hiring_SaaS_Full_Project
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
✅ Backend running at: `http://127.0.0.1:8000`

### 3. Frontend Setup (New Terminal)
```bash
# Navigate to frontend
cd frontend/ai-hiring-ui

# Install npm dependencies
npm install

# Start dev server
npm run dev
```
✅ Frontend running at: `http://localhost:5173`

### 4. Access Application
- **App**: http://localhost:5173/
- **API Docs**: http://127.0.0.1:8000/docs
- **Database**: `hiring_saas.db` (auto-created)

## 📝 How to Use

### For Candidates

1. **Register as Candidate**
   - Click "Login / Register"
   - Select "Register" tab
   - Fill in: email, username, password, full name
   - Select "Candidate" as role
   - Click Register

2. **Upload & Analyze Resume**
   - Click "For Candidates" in navbar
   - Select a resume file (PDF, DOC, TXT)
   - Select a job to match against
   - Click "Analyze & Match"
   - View:
     - Match score (0-100%)
     - Matched skills
     - Missing skills
     - Bias risk level
     - GitHub project verification

3. **Apply for Jobs**
   - Browse available job listings
   - Click "Apply" button
   - Your resume is submitted to recruiter

### For Recruiters

1. **Register as Recruiter**
   - Click "Login / Register"
   - Select "Register" tab
   - Fill in: email, username, password, full name, company name
   - Select "Recruiter" as role
   - Click Register

2. **Post a Job**
   - Go to "📋 Jobs" tab in Recruiter Dashboard
   - Fill in job details:
     - Job title
     - Description
     - Required skills (comma-separated)
     - Experience level
     - Salary range
     - Location
   - Click "Create Job"
   - Job appears in your jobs list

3. **Upload & Rank Resumes**
   - Go to "📤 Upload Resumes" tab
   - **Select a job** from the dropdown
   - Choose multiple resume files
   - Click "Upload & Analyze"
   - View rankings with:
     - Match scores
     - Matched/missing skills
     - Bias risk assessment
     - GitHub verification

4. **Manage Candidates**
   - Go to "👥 Candidates" tab
   - View all candidates for your jobs
   - Click to view detailed profiles
   - Make hiring decisions
   - Track through pipeline

5. **View Analytics**
   - Go to "📊 Analytics" tab
   - Monitor:
     - Total jobs posted
     - Total candidates processed
     - Average match score
     - Hiring funnel (Applied → Shortlisted → Offered → Hired)
     - Top skills among candidates
     - Bias alerts

6. **Delete Jobs**
   - Go to "📋 Jobs" tab
   - Click "Delete Job" button (red) on any job card
   - Confirm deletion

## 🔧 API Endpoints Reference

### Authentication
```
POST   /auth/register          - Create new user account
POST   /auth/login             - Login with email & password
GET    /auth/me                - Get current user info
```

### Recruiter Endpoints
```
POST   /recruiter/jobs                           - Create job
GET    /recruiter/jobs                           - List all recruiter's jobs
GET    /recruiter/jobs/{job_id}                  - Get job details
PUT    /recruiter/jobs/{job_id}                  - Update job
DELETE /recruiter/jobs/{job_id}                  - Delete job
POST   /recruiter/jobs/{job_id}/rank-candidates - Upload & rank resumes
GET    /recruiter/jobs/{job_id}/candidates      - Get candidates for job
POST   /recruiter/candidates/{id}/decision      - Make hiring decision
GET    /recruiter/analytics                     - Get analytics dashboard
```

### Candidate Endpoints
```
POST   /candidate/resumes                       - Upload resume
GET    /candidate/resumes                       - List candidate's resumes
POST   /candidate/match-resume                  - Match resume to job
GET    /candidate/jobs                          - Get matching jobs
GET    /candidate/applied-jobs                  - Get applied jobs
```

## 🗄️ Database Schema

### Users Table
```sql
id (string)              -- UUID
email (string)           -- Unique email
username (string)        -- Unique username
hashed_password (string) -- Argon2 hashed
user_type (string)       -- "recruiter" or "candidate"
full_name (string)       -- User's full name
company (string)         -- Company name (if recruiter)
is_active (boolean)      -- Account status
created_at (datetime)    -- Registration date
updated_at (datetime)    -- Last update
```

### Jobs Table
```sql
id (string)              -- UUID
recruiter_id (string)    -- Foreign key to Users
title (string)           -- Job title
description (text)       -- Job description
required_skills (json)   -- List of required skills
experience_level (string)-- "junior", "mid", "senior"
salary_range (string)    -- e.g., "$100k-$150k"
location (string)        -- Job location
is_active (boolean)      -- Active status
created_at (datetime)    -- Created date
```

### Resumes Table
```sql
id (string)              -- UUID
candidate_id (string)    -- Foreign key to Users
filename (string)        -- Original filename
file_path (string)       -- Server storage path
extracted_text (text)    -- Parsed resume text
skills (json)            -- Extracted skills list
experience_years (int)   -- Years of experience
github_projects (json)   -- GitHub projects found
is_primary (boolean)     -- Primary resume flag
created_at (datetime)    -- Upload date
```

### Job Matches Table
```sql
id (string)              -- UUID
job_id (string)          -- Foreign key to Jobs
resume_id (string)       -- Foreign key to Resumes
match_score (float)      -- 0-100 score
matched_skills (json)    -- Matching skills
missing_skills (json)    -- Missing skills
bias_risk_level (string) -- "Low", "Medium", "High"
bias_findings (json)     -- Specific bias issues found
projects_verified (int)  -- Number of verified projects
created_at (datetime)    -- Analysis date
```

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - Argon2 algorithm for password security
- ✅ **CORS Enabled** - Cross-origin requests configured
- ✅ **Input Validation** - Pydantic schema validation
- ✅ **Authorization Checks** - Role-based access control
- ✅ **Secure Headers** - HTTP security headers configured
- ⚠️ **Environment Variables** - Store sensitive data in `.env`

## 📦 Installation & Deployment

### Local Development
See "Quick Start" section above

### Production Deployment

**Backend (Python)**
```bash
# Use PostgreSQL instead of SQLite
export DATABASE_URL="postgresql://user:password@localhost/hiring_db"
export SECRET_KEY="your-secure-random-key"
export DEBUG="false"

# Run with Gunicorn
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Frontend (React)**
```bash
npm run build
# Deploy `dist/` folder to Vercel, Netlify, or web server
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux

# Kill process and restart
```

### Resume upload fails
```bash
# Check storage directory exists
mkdir -p backend/storage/resumes

# Check file permissions
chmod -R 755 backend/storage/
```

### JWT token errors
```bash
# Clear localStorage and login again
localStorage.clear()

# Check if SECRET_KEY is set in backend
echo $SECRET_KEY
```

### Database locked
```bash
# Remove old SQLite database
rm backend/hiring_saas.db

# Restart backend (will recreate)
```

## 🎓 How AI & Matching Works

### 1. Resume Analysis
- PDF/DOC files parsed into text
- Skills extracted using keyword matching and NLP
- Experience level calculated from work history
- GitHub URLs detected and verified

### 2. Job Matching
- Job description tokenized and embedded
- Resume skills embedded using Sentence Transformers
- Semantic similarity calculated (0-100 scale)
- Matched and missing skills identified

### 3. Bias Detection
- Job description scanned for discriminatory language
- Age indicators (e.g., "digital native", "young energy")
- Gender indicators (e.g., "aggressive", "nurturing")
- Diversity flags identified

### 4. GitHub Verification
- GitHub URLs extracted from resume
- GitHub API called to verify repository
- Stars, languages, and contributions counted
- Authenticity validated

## 📊 Example Analysis Output

```json
{
  "match_score": 87,
  "matched_skills": ["Python", "FastAPI", "React", "Docker"],
  "missing_skills": ["Kubernetes", "AWS"],
  "bias_risk_level": "Low",
  "bias_findings": [],
  "github_projects": [
    {
      "repo": "ai-hiring-saas",
      "stars": 42,
      "language": "Python",
      "verified": true
    }
  ],
  "experience_years": 5
}
```

## 🤝 Contributing

Want to improve this project?

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 🚀 Future Enhancements

- [ ] Email notifications for candidates & recruiters
- [ ] Advanced skill assessments & coding tests
- [ ] Video interview integration
- [ ] Interview scheduling system
- [ ] ATS integrations (Workable, Greenhouse, BambooHR)
- [ ] Salary benchmarking
- [ ] Diversity & inclusion reports
- [ ] Mobile app (React Native/Flutter)
- [ ] Real-time notifications (Socket.io)
- [ ] API marketplace for integrations
- [ ] Multi-language support
- [ ] Two-factor authentication

## 📄 License

MIT License - Feel free to use this project for personal and commercial purposes.

## 👨‍💻 Author

**Tanuk Hatiyan**
- GitHub: [@tanukhatiyan](https://github.com/tanukhatiyan)
- Repository: [AI-Powered-Hiring-SaaS-Platform](https://github.com/tanukhatiyan/AI-Powered-Hiring-SaaS-Platform)

## 📞 Support & Contact

For issues, questions, or feature requests:
1. Open a [GitHub Issue](https://github.com/tanukhatiyan/AI-Powered-Hiring-SaaS-Platform/issues)
2. Create a detailed bug report with steps to reproduce
3. Include error messages and screenshots

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Status**: Active Development ✅


### Backend (Terminal 1)
```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
✅ Backend: `http://localhost:8000`  
📚 API Docs: `http://localhost:8000/docs`

### Frontend (Terminal 2)
```bash
cd frontend/ai-hiring-ui
npm run dev
```
✅ Frontend: `http://localhost:5173`

## 🧪 Testing the Application

### Test Registration & Login
```bash
# Register as Candidate
curl -X POST http://127.0.0.1:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "username": "candidate1",
    "password": "Test@123",
    "full_name": "John Candidate",
    "user_type": "candidate"
  }'

# Login
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "Test@123"
  }'
```

### Check Health
```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/test-cors
```

## 📚 API Documentation

### Authentication

```
POST   /auth/register
- Register new user (recruiter or candidate)
- Body: { email, username, password, full_name, user_type, company }

POST /auth/login
- Login user
- Body: { email, password }

GET /auth/me
- Get current user info
- Headers: Authorization: Bearer {token}
```

### Recruiter Endpoints

```
POST /recruiter/jobs
- Create new job posting
- Headers: Authorization: Bearer {token}

GET /recruiter/jobs
- List all recruiter's jobs
- Headers: Authorization: Bearer {token}

GET /recruiter/jobs/{job_id}
- Get specific job details

PUT /recruiter/jobs/{job_id}
- Update job posting

POST /recruiter/jobs/{job_id}/rank-candidates
- Upload and rank multiple resumes against a job
- Form data: resumes (files), job_description (text)

GET /recruiter/jobs/{job_id}/candidates
- Get all candidates for a job (sorted by match score)

POST /recruiter/candidates/{candidate_id}/decision
- Make hiring decision (applied, shortlisted, rejected, offered, hired)
- Body: { job_id, status, feedback }

GET /recruiter/analytics
- Get hiring analytics and metrics
```

### Candidate Endpoints

```
POST /candidate/resumes
- Upload a resume
- Form data: resume (file)

GET /candidate/resumes
- Get all candidate's resumes

POST /candidate/match-resume
- Match resume against a job description
- Form data: resume (file), job_description (text)

POST /candidate/analyze-resume
- Analyze resume without job matching

GET /candidate/jobs
- Get matching jobs based on candidate's skills

GET /candidate/applied-jobs
- Get jobs candidate has applied to
```

## Database Models

### User
- id, email, username, hashed_password
- user_type (recruiter/candidate)
- full_name, company
- is_active, created_at, updated_at

### Resume
- id, candidate_id, filename, file_path
- extracted_text, skills, experience_years
- github_projects, is_primary
- created_at, updated_at

### Job
- id, recruiter_id, title, description
- required_skills, experience_level
- salary_range, location
- is_active, created_at, updated_at

### JobMatch
- id, job_id, resume_id
- match_score (0-100)
- matched_skills, missing_skills
- bias_risk_level, bias_findings
- projects_verified

### HiringDecision
- id, job_id, candidate_id, created_by
- status (applied/shortlisted/rejected/offered/hired)
- match_score, feedback
- created_at, updated_at

## Configuration

Edit `backend/.env` to configure:

```
DATABASE_URL=sqlite:///./hiring_saas.db  # Use PostgreSQL for production
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
DEBUG=true
```

## Technologies Used

### Backend
- **FastAPI** - Modern web framework
- **SQLAlchemy** - ORM for database
- **Sentence Transformers** - Semantic similarity
- **Scikit-learn** - Machine learning utilities
- **PDFPlumber** - PDF extraction
- **PyJWT** - JWT authentication
- **Passlib + Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client

## Development

### Adding New Features

1. **New API Endpoint**:
   - Add function to appropriate router (recruiter.py, candidate.py, auth.py)
   - Define Pydantic schema in schemas.py
   - Add database model in models.py if needed

2. **New Service**:
   - Create new file in `app/services/`
   - Import and use in routers

3. **Database Changes**:
   - Update models.py
   - Changes are auto-applied on next server start

### Testing

```bash
# Test API endpoints
curl http://localhost:8000/health

# Test CORS
curl http://localhost:8000/test-cors
```

## Production Deployment

### Backend
1. Use PostgreSQL instead of SQLite
2. Set `DEBUG=false`
3. Generate strong `SECRET_KEY`
4. Use environment variables for sensitive data
5. Deploy with Gunicorn/Uvicorn:
```bash
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend
```bash
npm run build
# Deploy dist/ folder to CDN or web server
```

## API Response Examples

### Successful Job Ranking
```json
{
  "job_id": "abc123",
  "total_resumes": 3,
  "results": [
    {
      "filename": "john_resume.pdf",
      "match_score": 95,
      "matched_skills": ["Python", "FastAPI", "React"],
      "missing_skills": ["Kubernetes"],
      "bias_risk": "Low",
      "verified_projects": 3
    }
  ]
}
```

### Authentication Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "recruiter@company.com",
    "username": "john_doe",
    "user_type": "recruiter",
    "company": "Tech Corp"
  }
}
```

## Error Handling

All API errors follow standard HTTP status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error response format:
```json
{
  "detail": "Error message"
}
```

## Logging

Logs are written to `logs/app.log` with the format:
```
2024-01-18 10:30:45,123 - app - INFO - POST /auth/login
```

## Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -am 'Add your feature'`
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request

## Future Enhancements

- [ ] Email notifications for candidates
- [ ] Advanced skill assessments
- [ ] Video interview integration
- [ ] Interview scheduling system
- [ ] ATS integrations (Workable, BambooHR)
- [ ] Salary benchmarking
- [ ] Diversity & inclusion reports
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] API marketplace

## License

MIT License - feel free to use for personal and commercial projects.

## Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact: support@aihiring.com

## Authors

- **Your Name** - Initial development

---

**Version**: 1.0.0  
**Last Updated**: January 2026
