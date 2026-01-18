import os, uuid, shutil
from pathlib import Path
from app.services.pdf_parser import extract_text_from_pdf

# Get the base directory of the current file
BASE_DIR = Path(__file__).parent.parent.parent  # Goes to backend/
BASE = BASE_DIR / "storage" / "resumes"

# Ensure directory exists
BASE.mkdir(parents=True, exist_ok=True)

def save_and_extract_resume(file):
    rid = str(uuid.uuid4())
    path = BASE / f"{rid}_{file.filename}"
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(str(path))
    else:
        with open(path, "r", errors="ignore") as f:
            text = f.read()

    return rid, text
