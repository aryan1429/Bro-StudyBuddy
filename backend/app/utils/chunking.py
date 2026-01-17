"""
Text chunking utilities
"""
from app.config import settings


def chunk_text(text: str, metadata: dict) -> list[dict]:
    """
    Split text into overlapping chunks with metadata
    
    Args:
        text: The text to chunk
        metadata: Base metadata (doc_id, filename, etc.)
    
    Returns:
        List of chunks with metadata
    """
    chunk_size = settings.chunk_size
    overlap = settings.chunk_overlap
    
    chunks = []
    start = 0
    chunk_index = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk_text = text[start:end]
        
        # Skip empty or very small chunks
        if len(chunk_text.strip()) < 50:
            start = end
            continue
        
        chunk_data = {
            "text": chunk_text,
            "chunk_index": chunk_index,
            **metadata
        }
        
        chunks.append(chunk_data)
        
        # Move forward with overlap
        start = end - overlap
        chunk_index += 1
    
    return chunks


def estimate_tokens(text: str) -> int:
    """Rough token estimation (1 token ≈ 4 characters)"""
    return len(text) // 4
