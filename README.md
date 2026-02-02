# Study Buddy - RAG-Powered Study Assistant 🎓

A production-quality "Chat with your notes" web application using Retrieval Augmented Generation (RAG). Upload PDFs or TXT files, ask questions with AI-powered answers and citations, and generate quizzes/flashcards for studying.

![Study Buddy](https://img.shields.io/badge/Next.js-14-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green) ![Qdrant](https://img.shields.io/badge/Qdrant-1.12-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## ✨ Features

### MVP Features (Implemented)
- ✅ **Document Upload**: PDF & TXT support with drag-and-drop
- ✅ **RAG Chat**: AI-powered Q&A with context from your documents
- ✅ **Citations**: Every answer includes source references (document name, page number, snippet)
- ✅ **Document Library**: View, filter, and delete uploaded documents
- ✅ **Study Mode**: Generate MCQs with explanations from your notes
- ✅ **Modern UI**: Dark theme with glassmorphism and smooth animations

### Technical Highlights
- 🔍 **Vector Search**: Qdrant for fast semantic similarity search
- 🤖 **LLM Integration**: Pluggable (Ollama/OpenAI/Anthropic)
- 📊 **Chunking Strategy**: 1000 chars with 200 overlap for optimal context
- 🎯 **Confidence Scoring**: Similarity threshold prevents hallucinations
- ⚡ **Performance**: Batch embedding generation, async processing
- 🎨 **UX**: Framer Motion animations, responsive design, accessibility

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Browser (Frontend)                      │
│                                                            │
│     Next.js 14 + TypeScript + Tailwind + Framer Motion   │
│     Components: Upload, Chat, Sources, Quiz               │
└───────────────────────┬──────────────────────────────────┘
                        │ REST API
                        ▼
┌──────────────────────────────────────────────────────────┐
│                FastAPI Backend (Python)                   │
│                                                            │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  Document   │  │   RAG        │  │    Study        │ │
│  │  Processor  │  │  Retrieval   │  │   Generator     │ │
│  │             │  │              │  │                 │ │
│  │ • PDF Parse │  │ • Embedding  │  │ • MCQ Gen       │ │
│  │ • Chunking  │  │ • Search     │  │ • Flashcards    │ │
│  │ • Metadata  │  │ • LLM Call   │  │                 │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
│                                                            │
│  Embeddings: sentence-transformers (all-MiniLM-L6-v2)     │
│  LLM: Ollama (llama2/mistral) - Free & Local              │
└───────┬──────────────────────┬─────────────────────────┘
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────┐
│   Qdrant     │      │  PostgreSQL  │
│ Vector Store │      │  (Optional)  │
│              │      │              │
│ • Embeddings │      │ • Metadata   │
│ • Metadata   │      │ • Sessions   │
│ • Search     │      │ • History    │
└──────────────┘      └──────────────┘
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion |
| **Backend** | FastAPI 0.115, Python 3.10+ |
| **Vector DB** | Qdrant 1.12 (Docker) |
| **Embeddings** | sentence-transformers (all-MiniLM-L6-v2, 384-dim) |
| **LLM** | Ollama (llama2/mistral) - **Free, runs locally!** |
| **Database** | PostgreSQL 16 / Supabase (user authentication, metadata) |
| **Cloud Infrastructure** | AWS EC2 (production deployment) |
| **Infrastructure** | Docker Compose |

---

## 🚀 Quick Start

### Prerequisites
- **Docker** & **Docker Compose** installed
- **Node.js 18+** and **npm**
- **Python 3.10+** (for local backend development)
- **Ollama** installed ([ollama.com](https://ollama.com)) with `llama2` or `mistral` model

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Bro-StudyBuddy
```

### 2. Install Ollama and Pull a Model
```bash
# Install Ollama from https://ollama.com
# Then pull a model:
ollama pull llama2
# or
ollama pull mistral
```

### 3. Start with Docker Compose
```bash
# Start all services (frontend, backend, Qdrant, PostgreSQL)
docker-compose up -d

# Wait a minute for services to initialize
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Qdrant Dashboard: http://localhost:6333/dashboard
```

### 4. Alternative: Manual Setup (for development)

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env: ensure OLLAMA_BASE_URL=http://localhost:11434

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Run dev server
npm run dev
```

**Qdrant (Docker):**
```bash
docker run -p 6333:6333 -p 6334:6334 \
  -v $(pwd)/qdrant_data:/qdrant/storage \
  qdrant/qdrant:v1.12.5
```

---

## 📖 How to Use

### 1. Upload Documents
- Go to **http://localhost:3000**
- Click **"Get Started"** → Main app
- Click **"Upload"** tab in the left sidebar
- Drag & drop a PDF or TXT file (max 10MB)
- Wait for processing (you'll see "Ready" status)

### 2. Chat with Your Notes
- Select a document from the list (left sidebar)
- Type a question in the chat input
- Get AI-powered answers with **source citations**
- Click citations in the right panel to view snippets

### 3. Generate Quizzes
- Click **"Study Mode"** in the header
- Select a document
- Choose number of questions (10, 15, or 20)
- Answer MCQs and get instant feedback with explanations

---

## 🔧 Configuration

### Backend Environment (.env)
```bash
# LLM Provider
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2  # or mistral

# Vector Database
QDRANT_HOST=localhost  # use "qdrant" in Docker
QDRANT_PORT=6333

# RAG Settings
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K_RETRIEVAL=6
SIMILARITY_THRESHOLD=0.7

# File Upload
MAX_FILE_SIZE_MB=10
ALLOWED_EXTENSIONS=pdf,txt
```

### Frontend Environment (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🎯 How RAG Works Here

```
1. DOCUMENT UPLOAD
   PDF/TXT → PyMuPDF extraction → Text chunks (1000 chars, 200 overlap)
   → sentence-transformers embedding (384-dim vectors)
   → Store in Qdrant with metadata (doc_id, filename, page_number)

2. CHAT QUERY
   User Question → Embed query (384-dim)
   → Cosine similarity search in Qdrant (top-k=6)
   → Filter by confidence (>0.7)
   → Build prompt with retrieved context
   → Ollama LLM generates answer
   → Return answer + citations (doc name, page, snippet, score)

3. STUDY MODE
   Select Document → Retrieve chunks
   → Send to LLM with structured prompt
   → Parse JSON response (MCQs with options, answers, explanations)
   → Display in interactive quiz UI
```

**Key Design Decisions:**
- **1000 char chunks**: Balance between context and precision
- **200 char overlap**: Prevent information loss at chunk boundaries
- **all-MiniLM-L6-v2**: Fast (80MB model), accurate for semantic search
- **Top-k=6**: Enough context without overwhelming LLM
- **Confidence 0.7**: Prevents hallucinations, triggers "I don't know" responses

---

## 📁 Project Structure

```
Bro-StudyBuddy/
├── frontend/                  # Next.js 14 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── app/
│   │   │   │   ├── page.tsx   # Main chat app
│   │   │   │   └── study/
│   │   │   │       └── page.tsx  # Quiz mode
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── globals.css    # Tailwind styles
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   ├── upload/            # UploadDropzone
│   │   │   ├── documents/         # DocList
│   │   │   ├── chat/              # ChatWindow
│   │   │   ├── sources/           # SourcesPanel
│   │   │   └── study/             # QuizMode
│   │   └── lib/
│   │       ├── api.ts         # API client
│   │       └── utils.ts       # Utilities
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                   # FastAPI app
│   ├── app/
│   │   ├── main.py            # FastAPI entry
│   │   ├── config.py          # Settings
│   │   ├── models/            # Pydantic models
│   │   ├── services/          # Business logic
│   │   │   ├── document_processor.py
│   │   │   ├── embeddings.py
│   │   │   ├── vector_store.py
│   │   │   ├── llm_provider.py
│   │   │   ├── retrieval.py
│   │   │   └── study_generator.py
│   │   └── api/               # Route handlers
│   │       ├── documents.py
│   │       ├── chat.py
│   │       └── study.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🧪 Testing

### Test Document Upload
1. Upload a sample PDF about a topic
2. Check document appears in list with "Ready" status
3. Verify chunks created (shown in document card)

### Test RAG Chat
```
Sample queries:
- "What is the main topic of this document?"
- "Summarize the key points from page 3"
- "Explain [concept] mentioned in the notes"

Expected: Relevant answer with 2-6 citations
```

### Test Study Mode
1. Select a processed document
2. Generate 10 MCQs
3. Verify questions are relevant to document content
4. Check explanations are accurate

---

## 🎨 UI/UX Features

- ✨ **Framer Motion**: Smooth page transitions, message animations
- 🌙 **Dark Mode**: Modern dark theme with high contrast
- 📱 **Responsive**: Works on desktop, tablet, mobile
- ♿ **Accessibility**: Keyboard navigation, ARIA labels
- 🎯 **Micro-interactions**: Hover states, button feedback
- 🔄 **Loading States**: Progress bars, spinners, skeleton screens

---

## 🔐 Security

- ✅ File validation (type, size limits)
- ✅ Filename sanitization (prevent path traversal)
- ✅ CORS configuration
- ✅ Input sanitization (prevent prompt injection)
- ❌ **TODO**: Rate limiting, user authentication

---

## 🐛 Troubleshooting

### "Connection refused" on backend
- Ensure Ollama is running: `ollama serve`
- Check Qdrant is running: `docker ps | grep qdrant`
- Verify backend started: `curl http://localhost:8000/health`

### Embeddings taking too long
- First run downloads the model (~80MB), subsequent runs are fast
- Model cached at `~/.cache/torch/sentence_transformers/`

### "I don't have enough information"
- Upload more relevant documents
- Try rephrasing your question
- Check similarity scores in citations (should be >0.7)

### Quiz generation fails
- Ensure document is fully processed ("Ready" status)
- LLM might timeout on very long documents (retry with smaller documents)
- Check Ollama is responding: `ollama list`

---

## 🚀 Next Steps (Future Enhancements)

- [ ] **Sessions**: Save/restore chat history  
- [ ] **Flashcards UI**: Interactive flip animation
- [ ] **Multi-document chat**: Aggregate results across multiple docs
- [ ] **Evaluation**: Metrics for retrieval accuracy
- [ ] **Auth**: Google OAuth integration
- [ ] **File formats**: DOCX, Markdown support
- [ ] **Streaming**: Real-time LLM response streaming
- [ ] **RAG improvements**: Reranking, hybrid search

---

## 📄 License

MIT License - feel free to use this for your portfolio!

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **FastAPI** - Python web framework
- **Qdrant** - Vector database
- **sentence-transformers** - Embedding models
- **Ollama** - Local LLM runtime
- **shadcn/ui** - Beautiful UI components
- **Framer Motion** - Animation library

---

## 📧 Contact

Built with ❤️ for modern studying. Questions? Open an issue!

---

**Ready to ace your exams? Start chatting with your notes! 🎓✨**
