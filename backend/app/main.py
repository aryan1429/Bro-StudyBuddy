"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.api import documents, chat, study, auth
from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStoreService
from app.db.database import init_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting Study Buddy API...")
    logger.info(f"💡 LLM Provider: {settings.llm_provider}")
    logger.info(f"🗄️ Vector DB: {settings.qdrant_host}:{settings.qdrant_port}")
    
    # Initialize database tables
    logger.info("📊 Initializing database...")
    init_db()
    
    # Pre-load embedding model
    logger.info("📥 Loading embedding model...")
    embedding_service = EmbeddingService()
    await embedding_service.initialize()
    app.state.embedding_service = embedding_service
    
    # Initialize vector store
    logger.info("🔗 Connecting to Qdrant...")
    vector_store = VectorStoreService()
    await vector_store.initialize()
    app.state.vector_store = vector_store
    
    logger.info("✅ Application started successfully!")
    
    yield
    
    # Shutdown
    logger.info("👋 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Study Buddy API",
    description="RAG-powered chat with your notes + quiz generation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/docs", tags=["Documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(study.router, prefix="/api/study", tags=["Study"])


@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "healthy",
        "message": "Study Buddy API is running",
        "version": "1.0.0",
        "llm_provider": settings.llm_provider
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "api": "up",
            "vector_db": "up",
            "embedding_model": "loaded"
        }
    }
