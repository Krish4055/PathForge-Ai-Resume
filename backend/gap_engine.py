import os
import torch
from sentence_transformers import SentenceTransformer, util
os.environ['SENTENCE_TRANSFORMERS_HOME'] = os.path.join(os.getcwd(), ".cache")
# Initialize model (cached during Docker build)
model = SentenceTransformer('all-MiniLM-L6-v2')

LEVEL_ORDER = {"beginner": 0, "intermediate": 1, "advanced": 2, "expert": 3}
SIMILARITY_THRESHOLD = 0.75

def analyze_gap(candidate_skills: list, required_skills: list) -> dict:
    if not candidate_skills or not required_skills:
        return {"missing": [], "weak": [], "satisfied": []}

    candidate_names = [s["skill"] for s in candidate_skills]
    required_names = [s["skill"] for s in required_skills]

    candidate_vecs = model.encode(candidate_names, convert_to_tensor=True)
    required_vecs = model.encode(required_names, convert_to_tensor=True)

    similarity_matrix = util.cos_sim(required_vecs, candidate_vecs)

    missing = []
    weak = []
    satisfied = []

    for i, req_skill in enumerate(required_skills):
        similarities = similarity_matrix[i]
        best_idx = torch.argmax(similarities).item()
        best_score = similarities[best_idx].item()

        if best_score < SIMILARITY_THRESHOLD:
            missing.append(req_skill["skill"])
        else:
            matched_candidate = candidate_skills[best_idx]
            candidate_level = LEVEL_ORDER.get(matched_candidate.get("level", "beginner"), 0)
            required_level = LEVEL_ORDER.get(req_skill.get("required_level", "beginner"), 0)

            if candidate_level >= required_level:
                satisfied.append(req_skill["skill"])
            else:
                weak.append({
                    "skill": req_skill["skill"],
                    "current": matched_candidate.get("level", "beginner"),
                    "required": req_skill.get("required_level", "intermediate"),
                    "priority": req_skill.get("priority", "important")
                })

    return {"missing": missing, "weak": weak, "satisfied": satisfied}
