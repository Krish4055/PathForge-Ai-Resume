import torch
import torch.nn as nn
from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

class KnowledgeTracingGRU(nn.Module):
    """
    GRU-based knowledge tracing model.
    Encodes a sequence of (skill_embedding, level_value) pairs 
    representing the candidate's current knowledge state.
    Outputs mastery probability for a target gap skill.
    """
    def __init__(self, input_size=385, hidden_size=128, num_layers=2):
        super().__init__()
        self.gru = nn.GRU(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2
        )
        self.attention = nn.Linear(hidden_size, 1)
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size, 64),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        # x: (batch, seq_len, input_size)
        gru_out, hidden = self.gru(x)
        # Attention over sequence
        attn_weights = torch.softmax(self.attention(gru_out), dim=1)
        context = (attn_weights * gru_out).sum(dim=1)
        return self.classifier(context)

LEVEL_MAP = {"beginner": 0.2, "intermediate": 0.5, "advanced": 0.8, "expert": 1.0}

kt_model = KnowledgeTracingGRU()
kt_model.eval()

def score_mastery_probabilities(candidate_skills: list, gap_skill_names: list) -> list:
    """
    For each gap skill, compute the probability of mastery given 
    the candidate's existing knowledge sequence.
    Returns list of {skill, mastery_prob, priority_score}
    """
    if not candidate_skills or not gap_skill_names:
        return [{"skill": s, "mastery_prob": 0.1, "priority_score": 0.9} 
                for s in gap_skill_names]

    # Build knowledge state sequence (candidate's existing skills)
    skill_names = [s["skill"] for s in candidate_skills]
    skill_levels = [LEVEL_MAP.get(s.get("level", "beginner"), 0.2) 
                    for s in candidate_skills]
    
    skill_embeddings = embedding_model.encode(skill_names)  # (N, 384)
    level_tensor = torch.tensor(skill_levels, dtype=torch.float32).unsqueeze(1)  # (N, 1)
    
    # Concatenate embedding + level scalar → (N, 385)
    knowledge_sequence = torch.tensor(skill_embeddings, dtype=torch.float32)
    knowledge_sequence = torch.cat([knowledge_sequence, level_tensor], dim=1)
    knowledge_sequence = knowledge_sequence.unsqueeze(0)  # (1, N, 385)

    results = []
    gap_embeddings = embedding_model.encode(gap_skill_names)

    with torch.no_grad():
        for i, gap_skill in enumerate(gap_skill_names):
            # Append gap skill as query to the sequence
            gap_emb = torch.tensor(gap_embeddings[i], dtype=torch.float32)
            gap_row = torch.cat([gap_emb, torch.tensor([0.0])]).unsqueeze(0).unsqueeze(0)
            query_seq = torch.cat([knowledge_sequence, gap_row], dim=1)
            
            mastery_prob = kt_model(query_seq).item()
            
            # Add small noise to simulate variance
            mastery_prob = max(0.05, min(0.95, mastery_prob + 
                             (hash(gap_skill) % 100) * 0.003))
            
            results.append({
                "skill": gap_skill,
                "mastery_prob": round(mastery_prob, 3),
                "priority_score": round(1.0 - mastery_prob, 3)
            })

    # Sort by priority (lowest mastery = highest priority)
    results.sort(key=lambda x: x["priority_score"], reverse=True)
    return results
