from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from parser import extract_text_from_pdf, clean_text
from extractor import extract_resume_skills, extract_jd_skills
from gap_engine import analyze_gap
from knowledge_tracer import score_mastery_probabilities
from pathing import build_learning_path
import json

app = FastAPI(title="PathForge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4028", "http://127.0.0.1:4028", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    resume_pdf: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Step 1: Parse
        pdf_bytes = await resume_pdf.read()
        resume_text = clean_text(extract_text_from_pdf(pdf_bytes))
        jd_text = clean_text(job_description)

        # Step 2: Extract skills via GenAI (Claude)
        candidate_skills = extract_resume_skills(resume_text)
        required_skills = extract_jd_skills(jd_text)

        # Step 3: Gap analysis via ANN (semantic embeddings)
        gap_result = analyze_gap(candidate_skills, required_skills)

        # Step 4: Knowledge tracing via RNN (mastery probabilities)
        gap_with_scores = score_mastery_probabilities(
            candidate_skills, 
            gap_result["missing"] + [g["skill"] for g in gap_result["weak"]]
        )

        # Step 5: Build adaptive path via DAG
        path_result = build_learning_path(gap_with_scores, required_skills)

        # Step 6: Calculate time saved
        total_hours = sum(c["duration_hours"] for c in path_result["learning_path"])
        hours_saved = max(0, 40 - total_hours) + 15  # 40hr generic baseline

        return {
            "candidate_skills": candidate_skills,
            "required_skills": required_skills,
            "skill_gaps": gap_result,
            "learning_path": path_result["learning_path"],
            "reasoning_trace": path_result["reasoning_trace"],
            "estimated_hours_saved": hours_saved,
            "total_hours": total_hours
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok", "service": "PathForge API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
