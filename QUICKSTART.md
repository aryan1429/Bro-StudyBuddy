# Study Buddy - Quick Start Guide

## Prerequisites Checklist
- [ ] Docker Desktop installed and running
- [ ] Ollama installed from https://ollama.com
- [ ] Node.js 18+ installed
- [ ] 4GB+ RAM available

## Setup Steps

### 1. Install Ollama LLM
```bash
# Download from ollama.com or use:
# Windows: Run the installer
# Mac: brew install ollama
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# Pull the model (choose one):
ollama pull llama2      # Good for most tasks, ~4GB
# OR
ollama pull mistral     # Faster, ~4GB
```

### 2. Start the Application

**Option A: Docker Compose (Recommended)**
```bash
cd Bro-StudyBuddy

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Wait ~1 minute for model loading
# Backend ready when you see: "✅ Application started successfully!"
```

**Option B: Manual (Development)**
```bash
# Terminal 1 - Qdrant
docker run -d -p 6333:6333 -v qdrant_data:/qdrant/storage qdrant/qdrant:v1.12.5

# Terminal 2 - Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows, or: source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
copy .env.example .env  # Edit if needed
uvicorn app.main:app --reload

# Terminal 3 - Frontend
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

### 3. Access the App
- Frontend: http://localhost:3000
- Backend API Docs: http://localhost:8000/docs
- Qdrant Dashboard: http://localhost:6333/dashboard

---

## First Time Usage

1. **Upload a Document**
   - Click "Get Started" on landing page
   - Click "Upload" tab
   - Drag a PDF or TXT file (max 10MB)
   - Wait for "Ready" status

2. **Chat**
   - Click the document in the list
   - Ask: "What is this document about?"
   - See answer with citations in right panel

3. **Study Mode**
   - Click "Study Mode" in header
   - Select document
   - Click "10 Questions"
   - Take the quiz!

---

## Troubleshooting

**"Connection refused" error:**
```bash
# Check Ollama is running:
ollama list
# If not running: ollama serve

# Check backend health:
curl http://localhost:8000/health
```

**Slow first upload:**
- First run downloads embedding model (~80MB)
- Subsequent uploads are much faster

**LLM timeout:**
- Ollama might be slow on first query
- Try smaller documents (<10 pages)
- Use mistral instead of llama2 for speed

**Frontend can't connect:**
- Ensure backend started successfully
- Check .env.local has correct API_URL

---

## Next Steps
- Upload your study notes
- Try different question types
- Generate quizzes for exam prep
- Explore the source code!

Need help? Check README.md for full documentation.
