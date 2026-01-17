"""
Pydantic models for chat
"""
from pydantic import BaseModel, Field


class Citation(BaseModel):
    doc_id: str
    doc_name: str
    page_number: int | None = None
    chunk_text: str
    similarity_score: float


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    doc_ids: list[str] = Field(default_factory=list, description="Filter by specific documents")
    session_id: str | None = None


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation]
    confidence: float
    session_id: str | None = None
