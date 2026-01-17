"""
Study mode API endpoints (MCQ, flashcards)
"""
from fastapi import APIRouter, HTTPException, Request
import logging

from app.models.study import (
    MCQRequest,
    MCQResponse,
    FlashcardRequest,
    FlashcardResponse
)
from app.services.study_generator import StudyGenerator
from app.services.llm_provider import LLMProvider

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/mcq", response_model=MCQResponse)
async def generate_mcq(request: Request, mcq_request: MCQRequest):
    """
    Generate multiple choice questions from a document
    """
    try:
        # Get services
        vector_store = request.app.state.vector_store
        llm_provider = LLMProvider()
        
        study_generator = StudyGenerator(
            llm_provider=llm_provider,
            vector_store=vector_store
        )
        
        # Generate MCQs
        questions = await study_generator.generate_mcqs(
            doc_id=mcq_request.doc_id,
            num_questions=mcq_request.num_questions
        )
        
        return MCQResponse(
            questions=questions,
            total=len(questions)
        )
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"MCQ generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating MCQs: {str(e)}")


@router.post("/flashcards", response_model=FlashcardResponse)
async def generate_flashcards(request: Request, flashcard_request: FlashcardRequest):
    """
    Generate flashcards from a document
    """
    try:
        # Get services
        vector_store = request.app.state.vector_store
        llm_provider = LLMProvider()
        
        study_generator = StudyGenerator(
            llm_provider=llm_provider,
            vector_store=vector_store
        )
        
        # Generate flashcards
        flashcards = await study_generator.generate_flashcards(
            doc_id=flashcard_request.doc_id,
            num_cards=flashcard_request.num_cards
        )
        
        return FlashcardResponse(
            flashcards=flashcards,
            total=len(flashcards)
        )
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Flashcard generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating flashcards: {str(e)}")
