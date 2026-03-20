import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

RESUME_SYSTEM_PROMPT = """You are a precise skill extraction engine for HR technology.
Given resume text, extract ALL technical and soft skills mentioned.
Return ONLY a valid JSON array. No explanation. No markdown. No preamble.
Each object must have exactly these fields:
- skill: string (normalize to full name e.g. "JS" → "JavaScript")
- level: string (exactly one of: beginner, intermediate, advanced, expert)
- years: integer (estimate from context, 0 if unclear)
Example output: [{"skill": "React", "level": "intermediate", "years": 2}]"""

JD_SYSTEM_PROMPT = """You are a job requirements parser for HR technology.
Given a job description, extract ALL required skills and qualifications.
Return ONLY a valid JSON array. No explanation. No markdown. No preamble.
Each object must have exactly these fields:
- skill: string (full normalized name)
- required_level: string (exactly one of: beginner, intermediate, advanced, expert)
- priority: string (exactly one of: core, important, nice-to-have)
Example output: [{"skill": "TypeScript", "required_level": "advanced", "priority": "core"}]"""

def extract_resume_skills(resume_text: str) -> list:
    if not os.getenv("GEMINI_API_KEY"):
         return [{"skill": "React", "level": "intermediate", "years": 2}]
         
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(
        f"{RESUME_SYSTEM_PROMPT}\n\nExtract skills from this resume:\n\n{resume_text[:4000]}"
    )
    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)

def extract_jd_skills(jd_text: str) -> list:
    if not os.getenv("GEMINI_API_KEY"):
         return [{"skill": "Next.js", "required_level": "advanced", "priority": "core"}]

    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(
        f"{JD_SYSTEM_PROMPT}\n\nExtract required skills from this job description:\n\n{jd_text[:4000]}"
    )
    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)
