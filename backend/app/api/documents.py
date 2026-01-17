"""
Document management API endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
import os
import uuid
import logging
from datetime import datetime

from app.models.document import (
    DocumentUploadResponse,
    DocumentStatus,
    DocumentMetadata,
    DocumentListResponse
)
from app.utils.file_validation import validate_file, sanitize_filename, get_file_extension
from app.services.document_processor import DocumentProcessor
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory document store (in production, use PostgreSQL)
documents_db = {}


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(request: Request, file: UploadFile = File(...)):
    """
    Upload and process a document (PDF or TXT)
    """
    try:
        # Validate file
        validate_file(file)
        
        # Generate doc ID
        doc_id = str(uuid.uuid4())
        filename = sanitize_filename(file.filename)
        file_ext = get_file_extension(filename)
        
        # Ensure upload directory exists
        os.makedirs(settings.upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(settings.upload_dir, f"{doc_id}.{file_ext}")
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        file_size = len(content)
        
        # Create document metadata
        doc_metadata = DocumentMetadata(
            doc_id=doc_id,
            filename=filename,
            file_size=file_size,
            upload_time=datetime.now(),
            status=DocumentStatus.PROCESSING
        )
        
        documents_db[doc_id] = doc_metadata
        
        # Process document asynchronously (in background)
        # For now, we'll process it synchronously
        try:
            # Get services from app state
            embedding_service = request.app.state.embedding_service
            vector_store = request.app.state.vector_store
            
            # Process document
            logger.info(f"Processing document {doc_id}...")
            result = DocumentProcessor.process_document(
                file_path=file_path,
                doc_id=doc_id,
                filename=filename,
                file_ext=file_ext
            )
            
            chunks = result["chunks"]
            logger.info(f"Created {len(chunks)} chunks")
            
            # Generate embeddings
            logger.info("Generating embeddings...")
            chunk_texts = [c["text"] for c in chunks]
            embeddings = embedding_service.embed_batch(chunk_texts)
            
            # Store in vector DB
            logger.info("Storing in vector database...")
            vector_store.add_chunks(chunks, embeddings)
            
            # Update metadata
            doc_metadata.status = DocumentStatus.READY
            doc_metadata.page_count = result["page_count"]
            doc_metadata.chunk_count = len(chunks)
            
            logger.info(f"✅ Document {doc_id} processed successfully")
        
        except Exception as e:
            logger.error(f"Error processing document: {e}")
            doc_metadata.status = DocumentStatus.FAILED
            doc_metadata.error_message = str(e)
            raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")
        
        return DocumentUploadResponse(
            doc_id=doc_id,
            filename=filename,
            status=doc_metadata.status,
            message="Document uploaded and processed successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=DocumentListResponse)
async def list_documents():
    """Get list of all uploaded documents"""
    docs = list(documents_db.values())
    return DocumentListResponse(
        documents=docs,
        total=len(docs)
    )


@router.delete("/{doc_id}")
async def delete_document(request: Request, doc_id: str):
    """Delete a document and its vectors"""
    if doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        # Delete from vector store
        vector_store = request.app.state.vector_store
        vector_store.delete_by_doc_id(doc_id)
        
        # Delete file
        doc = documents_db[doc_id]
        file_ext = get_file_extension(doc.filename)
        file_path = os.path.join(settings.upload_dir, f"{doc_id}.{file_ext}")
        
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Remove from DB
        del documents_db[doc_id]
        
        return {"message": "Document deleted successfully", "doc_id": doc_id}
    
    except Exception as e:
        logger.error(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
