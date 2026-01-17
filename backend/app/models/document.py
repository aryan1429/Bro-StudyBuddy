"""
Pydantic models for documents
"""
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class DocumentStatus(str, Enum):
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class DocumentUploadResponse(BaseModel):
    doc_id: str
    filename: str
    status: DocumentStatus
    message: str


class DocumentMetadata(BaseModel):
    doc_id: str
    filename: str
    file_size: int
    upload_time: datetime
    status: DocumentStatus
    page_count: int | None = None
    chunk_count: int | None = None
    error_message: str | None = None


class DocumentListResponse(BaseModel):
    documents: list[DocumentMetadata]
    total: int
