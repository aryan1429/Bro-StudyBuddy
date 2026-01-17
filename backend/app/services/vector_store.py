"""
Vector store service using Qdrant
"""
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue
)
from typing import List, Dict, Any
import logging
import uuid

from app.config import settings

logger = logging.getLogger(__name__)


class VectorStoreService:
    """Service for managing vectors in Qdrant"""
    
    def __init__(self):
        self.client = None
        self.collection_name = settings.qdrant_collection_name
    
    async def initialize(self):
        """Initialize Qdrant client and create collection if needed"""
        self.client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port
        )
        
        # Create collection if it doesn't exist
        collections = self.client.get_collections().collections
        collection_names = [col.name for col in collections]
        
        if self.collection_name not in collection_names:
            logger.info(f"Creating collection: {self.collection_name}")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=settings.embedding_dimension,
                    distance=Distance.COSINE
                )
            )
            logger.info("✅ Collection created")
        else:
            logger.info(f"✅ Collection {self.collection_name} already exists")
    
    def add_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]) -> int:
        """
        Add document chunks to vector store
        
        Args:
            chunks: List of chunk data with metadata
            embeddings: Corresponding embeddings
        
        Returns:
            Number of chunks added
        """
        points = []
        
        for chunk, embedding in zip(chunks, embeddings):
            point_id = str(uuid.uuid4())
            
            point = PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "doc_id": chunk.get("doc_id"),
                    "filename": chunk.get("filename"),
                    "page_number": chunk.get("page_number"),
                    "chunk_index": chunk.get("chunk_index"),
                    "text": chunk.get("text"),
                }
            )
            points.append(point)
        
        # Batch upsert
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        
        return len(points)
    
    def search(
        self,
        query_vector: List[float],
        top_k: int = None,
        doc_ids: List[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar chunks
        
        Args:
            query_vector: Query embedding
            top_k: Number of results (default from settings)
            doc_ids: Filter by document IDs (optional)
        
        Returns:
            List of search results with metadata and scores
        """
        if top_k is None:
            top_k = settings.top_k_retrieval
        
        # Build filter if doc_ids provided
        search_filter = None
        if doc_ids:
            search_filter = Filter(
                should=[
                    FieldCondition(
                        key="doc_id",
                        match=MatchValue(value=doc_id)
                    )
                    for doc_id in doc_ids
                ]
            )
        
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k,
            query_filter=search_filter
        )
        
        # Format results
        formatted_results = []
        for result in results:
            formatted_results.append({
                "id": result.id,
                "score": result.score,
                "doc_id": result.payload.get("doc_id"),
                "filename": result.payload.get("filename"),
                "page_number": result.payload.get("page_number"),
                "chunk_index": result.payload.get("chunk_index"),
                "text": result.payload.get("text"),
            })
        
        return formatted_results
    
    def delete_by_doc_id(self, doc_id: str) -> bool:
        """
        Delete all chunks for a document
        
        Args:
            doc_id: Document ID
        
        Returns:
            Success status
        """
        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=Filter(
                    must=[
                        FieldCondition(
                            key="doc_id",
                            match=MatchValue(value=doc_id)
                        )
                    ]
                )
            )
            return True
        except Exception as e:
            logger.error(f"Error deleting vectors for doc {doc_id}: {e}")
            return False
    
    def get_collection_info(self) -> Dict[str, Any]:
        """Get collection statistics"""
        info = self.client.get_collection(self.collection_name)
        return {
            "points_count": info.points_count,
            "vectors_count": info.vectors_count,
        }
