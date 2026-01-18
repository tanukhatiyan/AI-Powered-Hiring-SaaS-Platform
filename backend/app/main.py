from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from app.api import recruiter, candidate

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recruiter.router)
app.include_router(candidate.router)

@app.get("/")
def root():
    return {"status": "AI Hiring SaaS running"}

@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok", "message": "Backend is running"}

@app.get("/test-cors")
def test_cors():
    """Test CORS is working"""
    return {"corsEnabled": True, "message": "CORS is working correctly"}

@app.websocket("/ws/analyze")
async def analyze_ws(ws: WebSocket):
    await ws.accept()
    steps = [
        ("Parsing resume", 20),
        ("Extracting skills", 40),
        ("Semantic matching", 60),
        ("Bias check", 80),
        ("Finalizing result", 100),
    ]
    for step, prog in steps:
        await ws.send_json({"step": step, "progress": prog})
        await asyncio.sleep(1)
    await ws.close()
