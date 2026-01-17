"""
Study mode: MCQ and flashcard generation
"""
from typing import List
import json
import logging

from app.services.llm_provider import LLMProvider
from app.services.vector_store import VectorStoreService
from app.models.study import MCQuestion, MCQOption, Flashcard

logger = logging.getLogger(__name__)


class StudyGenerator:
    """Service for generating study materials (MCQs, flashcards)"""
    
    def __init__(self, llm_provider: LLMProvider, vector_store: VectorStoreService):
        self.llm_provider = llm_provider
        self.vector_store = vector_store
    
    async def generate_mcqs(self, doc_id: str, num_questions: int = 10) -> List[MCQuestion]:
        """
        Generate multiple choice questions from a document
        
        Args:
            doc_id: Document ID
            num_questions: Number of questions to generate
        
        Returns:
            List of MCQ objects
        """
        # Get all chunks for this document (we'll sample from them)
        # For simplicity, we'll use a large top_k to get all chunks
        dummy_vector = [0.0] * 384  # Just to get all chunks with this doc_id
        chunks = self.vector_store.search(
            query_vector=dummy_vector,
            top_k=100,
            doc_ids=[doc_id]
        )
        
        if not chunks:
            raise ValueError("No content found for this document")
        
        # Combine chunk texts
        content = "\n\n".join([c["text"] for c in chunks[:10]])  # Use first 10 chunks
        
        system_prompt = f"""You are an expert educator creating multiple choice questions for students.
Generate exactly {num_questions} high-quality multiple choice questions based on the provided content.

Return ONLY a JSON array in this exact format:
[
  {{
    "question": "Question text here?",
    "options": [
      {{"label": "A", "text": "Option A text"}},
      {{"label": "B", "text": "Option B text"}},
      {{"label": "C", "text": "Option C text"}},
      {{"label": "D", "text": "Option D text"}}
    ],
    "correct_answer": "A",
    "explanation": "Explanation of why A is correct and others are wrong"
  }}
]

Make questions challenging but fair. Ensure options are plausible."""
        
        user_prompt = f"Content to create questions from:\n\n{content}"
        
        # Generate
        response = await self.llm_provider.generate(user_prompt, system_prompt)
        
        # Parse JSON
        try:
            # Extract JSON from response (sometimes LLMs add extra text)
            json_start = response.find("[")
            json_end = response.rfind("]") + 1
            json_str = response[json_start:json_end]
            
            questions_data = json.loads(json_str)
            
            # Convert to Pydantic models
            mcqs = []
            for q_data in questions_data[:num_questions]:  # Ensure we don't exceed requested count
                mcq = MCQuestion(
                    question=q_data["question"],
                    options=[MCQOption(**opt) for opt in q_data["options"]],
                    correct_answer=q_data["correct_answer"],
                    explanation=q_data["explanation"]
                )
                mcqs.append(mcq)
            
            return mcqs
        
        except Exception as e:
            logger.error(f"Failed to parse MCQ response: {e}")
            logger.error(f"Response was: {response}")
            raise ValueError("Failed to generate valid MCQs")
    
    async def generate_flashcards(self, doc_id: str, num_cards: int = 10) -> List[Flashcard]:
        """
        Generate flashcards from a document
        
        Args:
            doc_id: Document ID
            num_cards: Number of flashcards to generate
        
        Returns:
            List of Flashcard objects
        """
        # Get chunks for this document
        dummy_vector = [0.0] * 384
        chunks = self.vector_store.search(
            query_vector=dummy_vector,
            top_k=100,
            doc_ids=[doc_id]
        )
        
        if not chunks:
            raise ValueError("No content found for this document")
        
        content = "\n\n".join([c["text"] for c in chunks[:10]])
        
        system_prompt = f"""You are an expert educator creating flashcards for students.
Generate exactly {num_cards} high-quality flashcards (question/answer pairs) based on the provided content.

Return ONLY a JSON array in this exact format:
[
  {{
    "question": "Question or term",
    "answer": "Detailed answer or definition"
  }}
]

Focus on key concepts, definitions, and important facts."""
        
        user_prompt = f"Content to create flashcards from:\n\n{content}"
        
        # Generate
        response = await self.llm_provider.generate(user_prompt, system_prompt)
        
        # Parse JSON
        try:
            json_start = response.find("[")
            json_end = response.rfind("]") + 1
            json_str = response[json_start:json_end]
            
            cards_data = json.loads(json_str)
            
            flashcards = [
                Flashcard(
                    question=card["question"],
                    answer=card["answer"]
                )
                for card in cards_data[:num_cards]
            ]
            
            return flashcards
        
        except Exception as e:
            logger.error(f"Failed to parse flashcard response: {e}")
            raise ValueError("Failed to generate valid flashcards")
