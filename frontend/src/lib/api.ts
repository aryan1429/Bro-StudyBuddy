/**
 * API client for Study Buddy backend
 */

// Use relative URL for production (nginx proxies /api to backend)
// Falls back to localhost for local development
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

export interface Document {
    doc_id: string;
    filename: string;
    file_size: number;
    upload_time: string;
    status: 'processing' | 'ready' | 'failed';
    page_count?: number;
    chunk_count?: number;
    error_message?: string;
}

export interface Citation {
    doc_id: string;
    doc_name: string;
    page_number?: number;
    chunk_text: string;
    similarity_score: number;
}

export interface ChatResponse {
    answer: string;
    citations: Citation[];
    confidence: number;
    session_id?: string;
}

export interface MCQOption {
    label: string;
    text: string;
}

export interface MCQuestion {
    question: string;
    options: MCQOption[];
    correct_answer: string;
    explanation: string;
}

export interface Flashcard {
    question: string;
    answer: string;
}

// API Functions
export const api = {
    // Documents
    async uploadDocument(file: File): Promise<{ doc_id: string; filename: string; status: string; message: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/api/docs/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Upload failed');
        }

        return res.json();
    },

    async getDocuments(): Promise<{ documents: Document[]; total: number }> {
        const res = await fetch(`${API_URL}/api/docs`);

        if (!res.ok) {
            throw new Error('Failed to fetch documents');
        }

        return res.json();
    },

    async deleteDocument(docId: string): Promise<void> {
        const res = await fetch(`${API_URL}/api/docs/${docId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error('Failed to delete document');
        }
    },

    // Chat
    async chat(query: string, docIds: string[] = []): Promise<ChatResponse> {
        const res = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, doc_ids: docIds }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Chat failed');
        }

        return res.json();
    },

    // Study
    async generateMCQs(docId: string, numQuestions: number = 10): Promise<{ questions: MCQuestion[]; total: number }> {
        const res = await fetch(`${API_URL}/api/study/mcq`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ doc_id: docId, num_questions: numQuestions }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'MCQ generation failed');
        }

        return res.json();
    },

    async generateFlashcards(docId: string, numCards: number = 10): Promise<{ flashcards: Flashcard[]; total: number }> {
        const res = await fetch(`${API_URL}/api/study/flashcards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ doc_id: docId, num_cards: numCards }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || 'Flashcard generation failed');
        }

        return res.json();
    },
};
