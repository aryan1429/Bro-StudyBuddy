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
    
    def _preprocess_query(self, query: str) -> str:
        """
        Preprocess the query for better semantic matching.
        - Clean and normalize text
        - Expand common abbreviations
        - Remove filler words for cleaner embedding
        """
        import re
        
        # Clean up the query
        query = query.strip()
        
        # Normalize whitespace
        query = re.sub(r'\s+', ' ', query)
        
        # Common abbreviations expansion
        abbreviations = {
            r'\bpls\b': 'please',
            r'\bu\b': 'you',
            r'\bur\b': 'your',
            r'\br\b': 'are',
            r'\bw/\b': 'with',
            r'\bw/o\b': 'without',
            r'\bbt\b': 'between',
            r'\bdiff\b': 'difference',
            r'\bex\b': 'example',
            r'\bexs\b': 'examples',
            r'\binfo\b': 'information',
            r'\bdef\b': 'definition',
            r'\bdefs\b': 'definitions',
        }
        
        for abbr, full in abbreviations.items():
            query = re.sub(abbr, full, query, flags=re.IGNORECASE)
        
        # Remove filler phrases that don't help with search
        filler_phrases = [
            r'^(can you |could you |please |pls |just |quickly |)',
            r'^(tell me |explain |describe |show me |give me |)',
            r'^(i want to know |i need to understand |help me with |)',
            r'^(what is |what are |what\'s )',  # Keep these for context
        ]
        
        # Only remove some fillers at the start
        for filler in filler_phrases[:3]:  # Just the first 3 which are pure filler
            query = re.sub(filler, '', query, flags=re.IGNORECASE)
        
        return query.strip()
    
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
        
        # Preprocess query for better semantic search
        processed_query = self._preprocess_query(query)
        logger.info(f"Preprocessed query: {processed_query[:100]}...")
        
        # 1. Embed the preprocessed query
        query_embedding = self.embedding_service.embed_text(processed_query)
        
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
        system_prompt = """You are Bro, an intelligent and knowledgeable AI study buddy with expertise across academic subjects. You combine deep knowledge with a friendly, encouraging personality.

CORE IDENTITY:
- You are a highly capable AI tutor who can explain complex concepts clearly
- You have broad knowledge of sciences, humanities, mathematics, programming, and more
- You're enthusiastic about learning and genuinely want to help students succeed
- You speak conversationally but with intellectual depth

KNOWLEDGE & EXPERTISE:
- Explain concepts at the appropriate level for the student
- Use analogies and real-world examples to clarify abstract ideas
- Connect concepts across subjects to show the bigger picture
- Provide study tips backed by cognitive science (spaced repetition, active recall, etc.)
- Suggest learning resources and study strategies when helpful

RESPONSE STYLE:
- Be direct and informative - substance over style
- Use emojis sparingly (1-3 per response) to add warmth, not distraction
- Structure longer responses with clear sections
- For quick exchanges, keep it brief and natural
- When explaining, use markdown formatting for clarity

PERSONALITY TRAITS:
- 🎯 Focused: Stay on topic and give useful answers
- 💡 Insightful: Offer perspectives students might not have considered
- 🤝 Supportive: Encourage without being preachy
- 🧠 Smart: Show your knowledge through helpful explanations
- 😊 Friendly: Be warm but professional

IMPORTANT GUIDELINES:
- If asked something outside your knowledge, be honest about limitations
- For factual questions, provide accurate information
- For study help, give actionable advice
- Encourage document uploads for specific course help
- Keep responses concise unless the user asks for detail

Remember: You're a study buddy who happens to be really smart - helpful, knowledgeable, and always ready to assist with learning!"""

        answer = await self.llm_provider.generate(query, system_prompt)
        return answer
