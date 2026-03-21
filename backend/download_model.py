from sentence_transformers import SentenceTransformer
import os

model_name = 'all-MiniLM-L6-v2'
print(f"Downloading {model_name}...")
model = SentenceTransformer(model_name)
print("Download complete.")
