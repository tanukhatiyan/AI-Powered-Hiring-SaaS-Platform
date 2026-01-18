# Deployment Guide

## Production Checklist

- [ ] Change `SECRET_KEY` in `.env`
- [ ] Set `DEBUG=false`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Configure CORS for specific domains
- [ ] Set up SSL/HTTPS
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Set up monitoring/logging
- [ ] Configure backups
- [ ] Load testing

---

## Option 1: Deploy on Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Backend Deployment

1. **Create `Procfile` in backend directory:**
```
web: gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

2. **Add runtime.txt (optional):**
```
python-3.11.0
```

3. **Login and create app:**
```bash
heroku login
heroku create your-app-name-api
```

4. **Set environment variables:**
```bash
heroku config:set SECRET_KEY="your-new-secret-key" --app your-app-name-api
heroku config:set DATABASE_URL="postgresql://..." --app your-app-name-api
heroku config:set DEBUG="false" --app your-app-name-api
```

5. **Add PostgreSQL addon:**
```bash
heroku addons:create heroku-postgresql:hobby-dev --app your-app-name-api
```

6. **Deploy:**
```bash
git push heroku main
```

### Frontend Deployment

1. **Build:**
```bash
cd frontend/ai-hiring-ui
npm run build
```

2. **Deploy to Heroku or Vercel:**
```bash
# Option A: Heroku
heroku create your-app-name-ui
git push heroku main

# Option B: Vercel
npm install -g vercel
vercel
```

---

## Option 2: Deploy on AWS

### Backend on EC2

1. **Launch EC2 instance:**
   - AMI: Ubuntu 22.04
   - Instance: t3.micro or larger
   - Security group: Allow HTTP, HTTPS, SSH

2. **SSH into instance:**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install dependencies:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3.11 python3-pip postgresql nginx -y
```

4. **Clone repository:**
```bash
git clone https://github.com/your-username/repo.git
cd repo/backend
```

5. **Setup Python environment:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

6. **Configure PostgreSQL:**
```bash
sudo -u postgres createdb hiring_saas
sudo -u postgres createuser hiring_user
```

7. **Create systemd service:**
```bash
sudo nano /etc/systemd/system/hiring-saas.service
```

Add:
```ini
[Unit]
Description=AI Hiring SaaS Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/AI-Powered-Hiring-SaaS-Platform/backend
ExecStart=/home/ubuntu/AI-Powered-Hiring-SaaS-Platform/backend/venv/bin/gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

8. **Start service:**
```bash
sudo systemctl daemon-reload
sudo systemctl start hiring-saas
sudo systemctl enable hiring-saas
```

9. **Configure Nginx reverse proxy:**
```bash
sudo nano /etc/nginx/sites-available/hiring-saas
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

10. **Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/hiring-saas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Frontend on S3 + CloudFront

1. **Build:**
```bash
npm run build
```

2. **Create S3 bucket:**
```bash
aws s3 mb s3://your-hiring-saas-ui
```

3. **Upload build files:**
```bash
aws s3 sync dist/ s3://your-hiring-saas-ui
```

4. **Create CloudFront distribution** pointing to S3

5. **Update API endpoint** in frontend `.env`:
```
VITE_API_URL=https://api.your-domain.com
```

---

## Option 3: Deploy on DigitalOcean

1. **Create droplet:**
   - OS: Ubuntu 22.04
   - Size: $4-6/month minimum
   
2. **Follow similar steps as AWS EC2** above

3. **Use DigitalOcean App Platform:**
   - Connect GitHub repo
   - Auto-deploy on push
   - Managed PostgreSQL database

---

## Production Configuration

### Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@db-host:5432/hiring_saas

# Security
SECRET_KEY=generate-strong-key-here-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Environment
ENVIRONMENT=production
DEBUG=false

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Logging
LOG_LEVEL=INFO
```

### Backend main.py Updates

```python
# Add to main.py for production CORS:
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Database Backup

```bash
# PostgreSQL backup
pg_dump -U hiring_user hiring_saas > backup.sql

# Restore
psql -U hiring_user hiring_saas < backup.sql

# Automated backup (cron job)
0 2 * * * /usr/bin/pg_dump -U hiring_user hiring_saas > /backups/hiring_saas_$(date +\%Y\%m\%d).sql
```

---

## Monitoring & Logging

### CloudWatch (AWS)
```bash
# Install CloudWatch agent
aws configure
```

### DataDog
```bash
# Install agent
DD_AGENT_MAJOR_VERSION=7 bash -c "$(curl -L https://install.datadoghq.com/scripts/install_unix_agent.sh)"
```

### ELK Stack
- Elasticsearch for logs
- Logstash for processing
- Kibana for visualization

---

## Performance Optimization

### Database
```sql
-- Create indexes
CREATE INDEX idx_job_recruiter ON jobs(recruiter_id);
CREATE INDEX idx_match_job ON job_matches(job_id);
CREATE INDEX idx_resume_candidate ON resumes(candidate_id);
CREATE INDEX idx_decision_job ON hiring_decisions(job_id);
```

### Caching
```python
# Add Redis caching
pip install redis
pip install aioredis

# In main.py:
from redis import asyncio as aioredis
redis = aioredis.from_url("redis://localhost")
```

### API Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(...):
    ...
```

---

## Security Best Practices

1. **Update Dependencies Regularly:**
```bash
pip list --outdated
pip install --upgrade -r requirements.txt
```

2. **Run Security Scan:**
```bash
pip install bandit
bandit -r app/
```

3. **HTTPS Everywhere:**
   - Force HTTPS redirect
   - Set HSTS headers

4. **Rate Limiting:**
   - Implement on login endpoint
   - Implement on upload endpoints

5. **Input Validation:**
   - Use Pydantic models
   - Sanitize file uploads
   - Validate file types

6. **Environment Variables:**
   - Never commit `.env`
   - Use `.env.example` with dummy values
   - Rotate secrets regularly

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        run: |
          git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
```

---

## Rollback Procedure

```bash
# Heroku
heroku releases
heroku rollback v42

# Git-based
git log --oneline
git revert <commit-hash>
git push origin main
```

---

## Monitoring Checklist

- [ ] API response times
- [ ] Error rates
- [ ] Database performance
- [ ] Storage usage
- [ ] User logins
- [ ] Failed file uploads
- [ ] Bias detection alerts

---

## Support & Troubleshooting

**503 Bad Gateway?**
- Check backend service status
- Review service logs

**Database connection error?**
- Verify DATABASE_URL
- Check database is running
- Verify credentials

**CORS errors?**
- Check ALLOWED_ORIGINS setting
- Clear browser cache

---

**Deployment successful! 🎉**
