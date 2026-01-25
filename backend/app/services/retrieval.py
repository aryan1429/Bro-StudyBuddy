"""
RAG retrieval pipeline
"""
from typing import List, Dict
import logging

from app.services.embeddings import EmbeddingService
from app.services.vector_store import VectorStoreService
from app.services.llm_provider import LLMProvider, build_rag_prompt
from app.models.chat import Citation
from app.config import settings

logger = logging.getLogger(__name__)


class RetrievalService:
    """Service for RAG retrieval and answer generation"""
    
    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_store: VectorStoreService,
        llm_provider: LLMProvider
    ):
        self.embedding_service = embedding_service
        self.vector_store = vector_store
        self.llm_provider = llm_provider
    
    def _is_casual_message(self, query: str) -> bool:
        """
        Detect if the query is a casual greeting or chitchat that doesn't need document retrieval.
        """
        query_lower = query.lower().strip()
        
        # Common greetings and casual phrases
        casual_patterns = [
            'hi', 'hello', 'hey', 'hii', 'hiii', 'yo', 'sup', 'heya', 'hola',
            'good morning', 'good afternoon', 'good evening', 'good night',
            'how are you', 'how r u', 'how are u', "how's it going", 'whats up', "what's up",
            'thanks', 'thank you', 'thx', 'ty', 'thank u',
            'bye', 'goodbye', 'see you', 'see ya', 'later', 'cya',
            'ok', 'okay', 'cool', 'nice', 'great', 'awesome', 'good',
            'yes', 'no', 'yeah', 'yep', 'nope', 'sure',
            'who are you', 'what are you', 'what can you do', 'help me',
            'introduce yourself', 'tell me about yourself',
        ]
        
        # Check for exact match or starts with
        for pattern in casual_patterns:
            if query_lower == pattern or query_lower.startswith(pattern + ' ') or query_lower.startswith(pattern + '!') or query_lower.startswith(pattern + '?'):
                return True
        
        # Very short queries (1-2 words) that aren't questions are likely casual
        words = query_lower.split()
        if len(words) <= 2 and not any(q in query_lower for q in ['what', 'why', 'how', 'when', 'where', 'explain', 'summarize', 'tell me about']):
            return True
        
        return False
    
    async def retrieve_and_answer(
        self,
        query: str,
        doc_ids: List[str] = None,
        top_k: int = None
    ) -> Dict[str, any]:
        """
        Full RAG pipeline: retrieve -> generate answer -> return with citations
        
        Args:
            query: User question
            doc_ids: Filter by specific documents (optional)
            top_k: Number of chunks to retrieve (default from settings)
        
        Returns:
            Dict with answer, citations, and confidence
        """
        # Check if this is a casual message that doesn't need document retrieval
        if self._is_casual_message(query):
            logger.info(f"Detected casual message, using general conversation mode...")
            answer = await self._general_conversation(query)
            return {
                "answer": answer,
                "citations": [],
                "confidence": 1.0
            }
        
        # 1. Embed the query
        logger.info(f"Embedding query: {query[:100]}...")
        query_embedding = self.embedding_service.embed_text(query)
        
        # 2. Search vector store
        logger.info(f"Searching vector store (top_k={top_k or settings.top_k_retrieval})...")
        results = self.vector_store.search(
            query_vector=query_embedding,
            top_k=top_k,
            doc_ids=doc_ids
        )
        
        # If no documents found, use general conversation mode
        if not results:
            logger.info("No documents found, using general conversation mode...")
            answer = await self._general_conversation(query)
            return {
                "answer": answer,
                "citations": [],
                "confidence": 1.0
            }
        
        # 3. Check confidence (avg similarity score)
        avg_score = sum(r["score"] for r in results) / len(results)
        logger.info(f"Average similarity score: {avg_score:.3f}")
        
        # If confidence too low, use general conversation with a hint about documents
        if avg_score < settings.similarity_threshold:
            logger.info("Low confidence, using general conversation mode...")
            answer = await self._general_conversation(query)
            return {
                "answer": answer,
                "citations": [],
                "confidence": avg_score
            }
        
        # 4. Build RAG prompt
        system_prompt, user_prompt = build_rag_prompt(query, results)
        
        # 5. Generate answer
        logger.info("Generating answer with LLM...")
        answer = await self.llm_provider.generate(user_prompt, system_prompt)
        
        # 6. Build citations
        citations = [
            Citation(
                doc_id=r["doc_id"],
                doc_name=r["filename"],
                page_number=r["page_number"],
                chunk_text=r["text"][:300] + "..." if len(r["text"]) > 300 else r["text"],
                similarity_score=r["score"]
            )
            for r in results
        ]
        
        return {
            "answer": answer,
            "citations": citations,
            "confidence": avg_score
        }
    
    async def _general_conversation(self, query: str) -> str:
        """
        Handle general conversation when no documents are available or relevant.
        Makes Bro smart and conversational.
        """
        system_prompt = """You are Bro, a friendly and intelligent AI study buddy! 🎓 You're helpful, encouraging, and knowledgeable.

Your personality:
- Friendly and approachable - like a smart friend who loves helping others learn 😊
- Encouraging and supportive of the user's learning journey 💪
- Knowledgeable across many subjects but humble when you're not sure
- You use casual but clear language with expressive emotions

Your communication style:
- Use emojis naturally to express emotions and make responses engaging (but don't overdo it - 2-4 per response is good)
- Show enthusiasm when explaining exciting concepts! 🚀
- Be empathetic and understanding when users are struggling 🤗
- Celebrate their wins and progress 🎉
- Express curiosity and interest in what they're learning 🤔

Emoji guide:
- Greetings: 👋 😊 🙌
- Encouragement: 💪 🌟 ✨ 🔥
- Success/Understanding: ✅ 🎯 💡 🎉
- Thinking/Explaining: 🤔 📚 🧠 💭
- Support/Empathy: 🤗 💙 👍
- Fun/Excitement: 🚀 ⭐ 😄

Your capabilities:
- You can have natural conversations and answer general questions
- You can help explain concepts, even without documents uploaded
- You can help with study tips, learning strategies, and motivation
- When the user uploads documents, you can answer questions specifically about them

Guidelines:
- Be conversational and natural - don't be robotic
- If asked about something you don't know, be honest
- Encourage users to upload their study materials for more specific help
- Keep responses helpful but concise unless the user asks for detail
- Use markdown formatting when it helps (headers, bullet points, etc.)

Remember: You're a study buddy first - supportive, smart, and always ready to help! 📖✨"""

        answer = await self.llm_provider.generate(query, system_prompt)
        return answer
