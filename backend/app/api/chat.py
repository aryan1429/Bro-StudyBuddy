"""
Chat API endpoints
"""
from fastapi import APIRouter, HTTPException, Request
import logging

from app.models.chat import ChatRequest, ChatResponse
from app.services.retrieval import RetrievalService
from app.services.llm_provider import LLMProvider

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(request: Request, chat_request: ChatRequest):
    """
    Chat with your documents using RAG
    """
    try:
        # Get services from app state
        embedding_service = request.app.state.embedding_service
        vector_store = request.app.state.vector_store
        llm_provider = LLMProvider()
        
        # Create retrieval service
        retrieval_service = RetrievalService(
            embedding_service=embedding_service,
            vector_store=vector_store,
            llm_provider=llm_provider
        )
        
        # Perform RAG
        result = await retrieval_service.retrieve_and_answer(
            query=chat_request.query,
            doc_ids=chat_request.doc_ids if chat_request.doc_ids else None
        )
        
        return ChatResponse(
            answer=result["answer"],
            citations=result["citations"],
            confidence=result["confidence"],
            session_id=chat_request.session_id
        )
    
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")
