"""
Configuration management using Pydantic Settings
"""
from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    # LLM Provider
    llm_provider: Literal["openai", "ollama", "anthropic", "groq"] = "ollama"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama2"
    openai_api_key: str | None = None
    openai_model: str = "gpt-3.5-turbo"
    anthropic_api_key: str | None = None
    anthropic_model: str = "claude-3-haiku-20240307"
    groq_api_key: str | None = None
    groq_model: str = "llama-3.3-70b-versatile"
    
    # Vector Database
    qdrant_host: str = "qdrant"
    qdrant_port: int = 6333
    qdrant_collection_name: str = "study_buddy_docs"
    
    # Database
    database_url: str = "postgresql://studybuddy:studybuddy123@postgres:5432/studybuddy"
    
    # File Upload
    upload_dir: str = "./uploads"
    max_file_size_mb: int = 10
    allowed_extensions: str = "pdf,txt"
    
    # Embeddings
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dimension: int = 384
    
    # RAG Settings
    chunk_size: int = 1000
    chunk_overlap: int = 200
    top_k_retrieval: int = 6
    similarity_threshold: float = 0.7
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://frontend:3000"
    
    # JWT Authentication
    jwt_secret_key: str = "your-super-secret-key-change-in-production-min-32-chars"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # Google OAuth
    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_redirect_uri: str = "http://localhost:3000/auth/google/callback"
    
    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def allowed_extensions_list(self) -> list[str]:
        return [ext.strip() for ext in self.allowed_extensions.split(",")]
    
    @property
    def max_file_size_bytes(self) -> int:
        return self.max_file_size_mb * 1024 * 1024
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
