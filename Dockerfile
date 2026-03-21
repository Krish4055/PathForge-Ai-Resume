# Multi-stage build for PathForge
# Stage 1: Build Frontend (Next.js)
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Backend (Python/FastAPI)
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies + Node.js
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy backend
COPY backend/requirements.txt ./backend/
# Use torch-cpu to save space (crucial for Render free tier)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r backend/requirements.txt

# Pre-download SentenceTransformer model to avoid runtime downloads
COPY backend/download_model.py ./backend/
ENV SENTENCE_TRANSFORMERS_HOME=/app/.cache
RUN python backend/download_model.py

# Copy everything
COPY . .
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/node_modules ./node_modules

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Start script
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port 8000 & npm run start"]
