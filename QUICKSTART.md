# Quick Start Guide

## 5-Minute Setup

### Prerequisites
- Python 3.10+
- Node.js 16+
- Git

### Step 1: Clone & Install Backend
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start Backend
```bash
python -m uvicorn app.main:app --reload
```
✓ Backend running at `http://localhost:8000`

### Step 3: Install Frontend
```bash
cd frontend/ai-hiring-ui
npm install
```

### Step 4: Start Frontend
```bash
npm run dev
```
✓ Frontend running at `http://localhost:5173`

### Step 5: Access Application
- **Web App**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs

---

## Default Test Credentials

### Register New Account
Visit `/register` page and create:
- Email: recruiter@test.com
- Password: Test123!@#
- Role: Recruiter (or Candidate)

### API Testing with cURL

**1. Register:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@test.com",
    "username": "recruiter1",
    "password": "Test123!@#",
    "full_name": "John Recruiter",
    "user_type": "recruiter",
    "company": "Tech Corp"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@test.com",
    "password": "Test123!@#"
  }'
```

**3. Create Job (with token from login):**
```bash
curl -X POST http://localhost:8000/recruiter/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Python Developer",
    "description": "Looking for experienced Python developer...",
    "required_skills": ["Python", "FastAPI", "PostgreSQL"],
    "experience_level": "senior",
    "salary_range": "$120k-$150k",
    "location": "San Francisco, CA"
  }'
```

---

## Workflow Example

### For Recruiters

1. **Login/Register** → Create account as "Recruiter"
2. **Create Job** → Post new job opening
3. **Upload Resumes** → Upload candidate resumes
4. **Rank Candidates** → System ranks by match score
5. **Review Bias** → Check for potential biases
6. **Make Decisions** → Shortlist or reject candidates
7. **View Analytics** → Track hiring funnel metrics

### For Candidates

1. **Login/Register** → Create account as "Candidate"
2. **Upload Resume** → Submit resume/CV
3. **Browse Jobs** → See matching job openings
4. **Check Match** → See job match scores
5. **View Feedback** → Get AI analysis of skills gap
6. **Track Applications** → Monitor application status

---

## Database

Default SQLite database (`hiring_saas.db`) is created automatically.

### Switch to PostgreSQL (Production)

1. **Install PostgreSQL**
2. **Create database:**
```bash
createdb hiring_saas
```

3. **Update `.env`:**
```
DATABASE_URL=postgresql://user:password@localhost:5432/hiring_saas
```

4. **Restart backend** - tables created automatically

---

## Troubleshooting

### Port 8000 already in use
```bash
# Use different port:
python -m uvicorn app.main:app --reload --port 8001
```

### Port 5173 already in use
```bash
# Vite uses next available port automatically
npm run dev -- --port 5174
```

### Database locked error
```bash
# Delete old database and restart:
rm hiring_saas.db
python -m uvicorn app.main:app --reload
```

### Dependencies not installing
```bash
# Upgrade pip first:
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### CORS errors
- Backend CORS is enabled for all origins in development
- For production, update `main.py` origins

---

## Environment Variables

Create `.env` in `backend/` folder:

```
# Database
DATABASE_URL=sqlite:///./hiring_saas.db

# Security
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Logging
ENVIRONMENT=development
DEBUG=true
```

---

## Common Tasks

### Upload Test Resume
```bash
curl -X POST http://localhost:8000/candidate/resumes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@/path/to/resume.pdf"
```

### Rank Multiple Resumes
```bash
curl -X POST http://localhost:8000/recruiter/jobs/{job_id}/rank-candidates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resumes=@resume1.pdf" \
  -F "resumes=@resume2.pdf" \
  -F "resumes=@resume3.pdf"
```

### Get Recruiter Analytics
```bash
curl -X GET http://localhost:8000/recruiter/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Next Steps

- [ ] Build frontend UI components
- [ ] Connect frontend forms to API
- [ ] Add email notifications
- [ ] Set up production database
- [ ] Deploy to AWS/Heroku
- [ ] Configure custom domain
- [ ] Set up SSL/HTTPS

---

## Getting Help

1. **API Documentation**: http://localhost:8000/docs
2. **Check logs**: `logs/app.log`
3. **GitHub Issues**: [Create issue](https://github.com/tanukhatiyan/AI-Powered-Hiring-SaaS-Platform/issues)

---

**Happy hiring! 🚀**
