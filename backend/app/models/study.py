"""
Pydantic models for study mode (MCQ, flashcards)
"""
from pydantic import BaseModel, Field


class MCQOption(BaseModel):
    label: str  # A, B, C, D
    text: str


class MCQuestion(BaseModel):
    question: str
    options: list[MCQOption]
    correct_answer: str  # A, B, C, or D
    explanation: str


class MCQRequest(BaseModel):
    doc_id: str
    num_questions: int = Field(default=10, ge=5, le=20)


class MCQResponse(BaseModel):
    questions: list[MCQuestion]
    total: int


class Flashcard(BaseModel):
    question: str
    answer: str


class FlashcardRequest(BaseModel):
    doc_id: str
    num_cards: int = Field(default=10, ge=5, le=30)


class FlashcardResponse(BaseModel):
    flashcards: list[Flashcard]
    total: int
