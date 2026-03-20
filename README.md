# PathForge — AI-Adaptive Onboarding Engine

PathForge analyzes a candidate's resume against a target job description, identifies skill gaps using AI + neural models, and generates a personalized, prerequisite-aware learning roadmap from a curated course catalog.

## 🧠 AI Architecture
1. **GenAI (Google Gemini)** → Skill extraction + reasoning generation
2. **ANN (sentence-transformers)** → Semantic skill matching / fuzzy normalization  
3. **RNN (PyTorch GRU)** → Knowledge tracing / mastery probability scoring

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Python 3.11, FastAPI, pdfplumber, Google Generative AI, sentence-transformers, PyTorch, NetworkX

## 📁 Project Structure
- `backend/`: FastAPI server and AI logic layers.
- `src/`: Next.js frontend application.
- `public/`: Static assets.
- `Dockerfile`: Multi-stage build for full-stack deployment.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- Python 3.11+
- Google Gemini API Key

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
```
Create a `.env` file in the root directory (use `.env.example` as a template) and add your `GEMINI_API_KEY`.

### 3. Setup Frontend
```bash
npm install
```

### 4. Run Application
Run the backend:
```bash
python backend/main.py
```

Run the frontend:
```bash
npm run dev
```
Open [http://localhost:4028](http://localhost:4028) in your browser.

## 🚀 Render Deployment
The project is ready for deployment on **Render.com** using the included `render.yaml`. 

1. Push your code to a GitHub repository.
2. Connect your GitHub account to Render.
3. Click **"New"** → **"Blueprint"** on the Render dashboard.
4. Select this repository. It will automatically detect the settings in `render.yaml` and deploy:
   - **Backend**: FastAPI web service.
   - **Frontend**: Next.js web service.

Make sure to add your `GEMINI_API_KEY` to the **Environment Variables** in the Render dashboard for the backend service.

## 🙏 Acknowledgments
- Inspired by the PathForge hackathon master prompt.
- Built for AI-adaptive learning and onboarding.