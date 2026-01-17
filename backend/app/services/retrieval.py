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
        
        if not results:
            return {
                "answer": "I couldn't find any relevant information in your documents. Please try rephrasing your question or uploading more documents.",
                "citations": [],
                "confidence": 0.0
            }
        
        # 3. Check confidence (avg similarity score)
        avg_score = sum(r["score"] for r in results) / len(results)
        logger.info(f"Average similarity score: {avg_score:.3f}")
        
        # If confidence too low, return uncertain response
        if avg_score < settings.similarity_threshold:
            return {
                "answer": "I'm not very confident about this based on your documents. The information might not be directly covered. Could you rephrase your question or provide more context?",
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
