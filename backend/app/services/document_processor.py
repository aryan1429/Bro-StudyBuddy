"""
Document processing service (PDF/TXT extraction + chunking)
"""
import fitz  # PyMuPDF
import os
import logging
from typing import Dict, List

from app.utils.chunking import chunk_text

logger = logging.getLogger(__name__)


class DocumentProcessor:
    """Service for extracting text from documents"""
    
    @staticmethod
    def extract_pdf(file_path: str) -> Dict[str, any]:
        """
        Extract text from PDF with page numbers
        
        Args:
            file_path: Path to PDF file
        
        Returns:
            Dict with full_text, page_texts, and page_count
        """
        try:
            doc = fitz.open(file_path)
            page_texts = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                page_texts.append({
                    "page_number": page_num + 1,  # 1-indexed
                    "text": text
                })
            
            full_text = "\n\n".join([p["text"] for p in page_texts])
            
            doc.close()
            
            return {
                "full_text": full_text,
                "page_texts": page_texts,
                "page_count": len(page_texts)
            }
        
        except Exception as e:
            logger.error(f"Error extracting PDF: {e}")
            raise ValueError(f"Failed to extract PDF: {str(e)}")
    
    @staticmethod
    def extract_txt(file_path: str) -> Dict[str, any]:
        """
        Extract text from TXT file
        
        Args:
            file_path: Path to TXT file
        
        Returns:
            Dict with full_text and page_count (1 for txt)
        """
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252']
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as f:
                        text = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            else:
                raise ValueError("Could not decode text file with common encodings")
            
            return {
                "full_text": text,
                "page_texts": [{"page_number": 1, "text": text}],
                "page_count": 1
            }
        
        except Exception as e:
            logger.error(f"Error extracting TXT: {e}")
            raise ValueError(f"Failed to extract TXT: {str(e)}")
    
    @staticmethod
    def process_document(file_path: str, doc_id: str, filename: str, file_ext: str) -> Dict[str, any]:
        """
        Process document: extract text + create chunks
        
        Args:
            file_path: Path to file
            doc_id: Document ID
            filename: Original filename
            file_ext: File extension (pdf, txt)
        
        Returns:
            Dict with chunks and metadata
        """
        # Extract text
        if file_ext == "pdf":
            extracted = DocumentProcessor.extract_pdf(file_path)
        elif file_ext == "txt":
            extracted = DocumentProcessor.extract_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
        
        # Create chunks with page tracking
        all_chunks = []
        
        for page_data in extracted["page_texts"]:
            page_number = page_data["page_number"]
            page_text = page_data["text"]
            
            if not page_text.strip():
                continue
            
            # Chunk this page
            page_chunks = chunk_text(
                text=page_text,
                metadata={
                    "doc_id": doc_id,
                    "filename": filename,
                    "page_number": page_number
                }
            )
            
            all_chunks.extend(page_chunks)
        
        return {
            "chunks": all_chunks,
            "page_count": extracted["page_count"],
            "total_chunks": len(all_chunks),
            "full_text_length": len(extracted["full_text"])
        }
