"""
Chat API endpoints
"""
from fastapi import APIRouter, HTTPException, Request
import logging
import re

from app.models.chat import ChatRequest, ChatResponse
from app.services.retrieval import RetrievalService
from app.services.llm_provider import LLMProvider
from app.services.study_generator import StudyGenerator

logger = logging.getLogger(__name__)
router = APIRouter()


def detect_intent(query: str) -> str:
    """
    Detect user intent from query
    
    Returns:
        'flashcard', 'mcq', or 'chat'
    """
    query_lower = query.lower()
    
    # Flashcard patterns - any mention of flashcard triggers generation
    flashcard_keywords = ['flashcard', 'flash card', 'flash-card', 'study card', 'revision card']
    for keyword in flashcard_keywords:
        if keyword in query_lower:
            return 'flashcard'
    
    # MCQ patterns - any mention of quiz/mcq triggers generation
    mcq_keywords = ['mcq', 'quiz', 'multiple choice', 'test me', 'practice question']
    for keyword in mcq_keywords:
        if keyword in query_lower:
            return 'mcq'
    
    return 'chat'


def format_flashcards_as_chat(flashcards: list, doc_name: str = "document") -> str:
    """Format flashcards as a nice chat response"""
    response = f"📚 **Here are your flashcards from {doc_name}:**\n\n"
    
    for i, card in enumerate(flashcards, 1):
        response += f"**Card {i}**\n"
        response += f"📝 **Q:** {card.question}\n"
        response += f"💡 **A:** {card.answer}\n\n"
    
    response += f"\n---\n✨ *Generated {len(flashcards)} flashcards. Go to **Study Mode** to practice with interactive flip cards!*"
    return response


def format_mcqs_as_chat(mcqs: list, doc_name: str = "document") -> str:
    """Format MCQs as a nice chat response"""
    response = f"📝 **Here are your quiz questions from {doc_name}:**\n\n"
    
    for i, q in enumerate(mcqs, 1):
        response += f"**Question {i}:** {q.question}\n"
        for opt in q.options:
            response += f"   {opt.label}) {opt.text}\n"
        response += f"\n"
    
    response += f"\n---\n✨ *Generated {len(mcqs)} questions. Go to **Study Mode** to take an interactive quiz with scoring!*"
    return response


@router.post("", response_model=ChatResponse)
async def chat(request: Request, chat_request: ChatRequest):
    """
    Chat with your documents using RAG
    Supports intent detection for flashcards, MCQs, and general Q&A
    """
    try:
        # Get services from app state
        embedding_service = request.app.state.embedding_service
        vector_store = request.app.state.vector_store
        llm_provider = LLMProvider()
        
        # Detect intent
        intent = detect_intent(chat_request.query)
        logger.info(f"Detected intent: {intent} for query: {chat_request.query}")
        logger.info(f"Doc IDs received: {chat_request.doc_ids}")
        
        # Handle flashcard/MCQ intents
        if intent in ['flashcard', 'mcq'] and chat_request.doc_ids:
            study_generator = StudyGenerator(
                llm_provider=llm_provider,
                vector_store=vector_store
            )
            
            # Get document name for display
            doc_id = chat_request.doc_ids[0]
            doc_name = doc_id.split('_')[0] if '_' in doc_id else "your document"
            
            if intent == 'flashcard':
                flashcards = await study_generator.generate_flashcards(
                    doc_id=doc_id,
                    num_cards=5  # Quick generation for chat
                )
                answer = format_flashcards_as_chat(flashcards, doc_name)
                citations = [{
                    "doc_id": doc_id,
                    "doc_name": doc_name,
                    "page_number": None,
                    "chunk_text": "Flashcards generated from document content",
                    "similarity_score": 1.0
                }]
            else:  # mcq
                mcqs = await study_generator.generate_mcqs(
                    doc_id=doc_id,
                    num_questions=5  # Quick generation for chat
                )
                answer = format_mcqs_as_chat(mcqs, doc_name)
                citations = [{
                    "doc_id": doc_id,
                    "doc_name": doc_name,
                    "page_number": None,
                    "chunk_text": "Quiz questions generated from document content",
                    "similarity_score": 1.0
                }]
            
            return ChatResponse(
                answer=answer,
                citations=citations,
                confidence=0.95,
                session_id=chat_request.session_id
            )
        
        # Default: RAG Q&A
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
