# AI Hiring SaaS Platform

An intelligent, AI-powered recruitment platform that uses machine learning to analyze resumes, match candidates to jobs, detect bias in hiring processes, and verify technical credentials.

## Features

### Core Features
- **AI Resume Analysis** - Automated resume parsing and skill extraction using NLP
- **Job Matching** - Semantic similarity matching between candidates and job descriptions
- **Bias Detection** - Identifies potential gender, age, and demographic bias in job descriptions and hiring decisions
- **GitHub Verification** - Validates candidate GitHub profiles and project experience
- **Multi-User Portals** - Separate interfaces for recruiters and candidates
- **Real-Time Progress** - WebSocket support for live analysis updates

### Advanced Features
- **Hiring Analytics** - Track hiring funnel, average match scores, and key metrics
- **Decision History** - Full audit trail of hiring decisions
- **Bulk Resume Processing** - Process multiple candidates simultaneously
- **JWT Authentication** - Secure user authentication with tokens
- **Database Persistence** - Store resumes, jobs, matches, and decisions

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── recruiter.py     # Recruiter-specific endpoints
│   │   └── candidate.py     # Candidate-specific endpoints
│   ├── services/
│   │   ├── ai_engine.py     # Match calculation logic
│   │   ├── bias_checker.py  # Bias detection logic
│   │   ├── github_verifier.py # GitHub verification
│   │   ├── pdf_parser.py    # PDF extraction
│   │   └── resume_service.py # Resume file handling
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT/Password utilities
│   ├── database.py          # Database configuration
│   ├── logging_config.py    # Logging setup
│   └── main.py              # FastAPI app entry point
├── storage/
│   └── resumes/             # Uploaded resume storage
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── logs/                    # Application logs

frontend/
├── ai-hiring-ui/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   └── main.jsx         # React entry point
│   └── package.json         # Node dependencies
```

## Installation

### Backend Setup

1. **Create Python virtual environment** (optional but recommended):
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
```

2. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

3. **Create .env file**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database**:
```bash
python -m uvicorn app.main:app --reload
```
The database will be created automatically on first run.

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend/ai-hiring-ui
npm install
```

2. **Run development server**:
```bash
npm run dev
```

## Running the Application

### Backend (Terminal 1)
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend will be available at `http://localhost:8000`

### Frontend (Terminal 2)
```bash
cd frontend/ai-hiring-ui
npm run dev
```
Frontend will be available at `http://localhost:5173`

### API Documentation
Once backend is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication

```
POST /auth/register
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
