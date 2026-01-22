"""
LLM provider abstraction layer
Supports OpenAI, Ollama, Anthropic, and Groq
"""
import httpx
from typing import List, Dict
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class LLMProvider:
    """Abstract LLM provider with pluggable backends"""
    
    def __init__(self):
        self.provider = settings.llm_provider
    
    async def generate(self, prompt: str, system_prompt: str | None = None) -> str:
        """
        Generate response from LLM
        
        Args:
            prompt: User prompt
            system_prompt: System instructions (optional)
        
        Returns:
            Generated text
        """
        if self.provider == "ollama":
            return await self._generate_ollama(prompt, system_prompt)
        elif self.provider == "openai":
            return await self._generate_openai(prompt, system_prompt)
        elif self.provider == "anthropic":
            return await self._generate_anthropic(prompt, system_prompt)
        elif self.provider == "groq":
            return await self._generate_groq(prompt, system_prompt)
        else:
            raise ValueError(f"Unknown LLM provider: {self.provider}")
    
    async def _generate_ollama(self, prompt: str, system_prompt: str | None) -> str:
        """Generate using Ollama (local)"""
        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                payload = {
                    "model": settings.ollama_model,
                    "prompt": prompt,
                    "stream": False
                }
                
                if system_prompt:
                    payload["system"] = system_prompt
                
                response = await client.post(
                    f"{settings.ollama_base_url}/api/generate",
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                return result.get("response", "")
        
        except Exception as e:
            logger.error(f"Ollama generation error: {e}")
            raise RuntimeError(f"Failed to generate with Ollama: {str(e)}")
    
    async def _generate_openai(self, prompt: str, system_prompt: str | None) -> str:
        """Generate using OpenAI"""
        try:
            from openai import AsyncOpenAI
            
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = await client.chat.completions.create(
                model=settings.openai_model,
                messages=messages,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"OpenAI generation error: {e}")
            raise RuntimeError(f"Failed to generate with OpenAI: {str(e)}")
    
    async def _generate_anthropic(self, prompt: str, system_prompt: str | None) -> str:
        """Generate using Anthropic Claude"""
        try:
            from anthropic import AsyncAnthropic
            
            client = AsyncAnthropic(api_key=settings.anthropic_api_key)
            
            response = await client.messages.create(
                model=settings.anthropic_model,
                max_tokens=1024,
                system=system_prompt or "",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            return response.content[0].text
        
        except Exception as e:
            logger.error(f"Anthropic generation error: {e}")
            raise RuntimeError(f"Failed to generate with Anthropic: {str(e)}")
    
    async def _generate_groq(self, prompt: str, system_prompt: str | None) -> str:
        """Generate using Groq (fast inference)"""
        try:
            from groq import AsyncGroq
            
            client = AsyncGroq(api_key=settings.groq_api_key)
            
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})
            
            response = await client.chat.completions.create(
                model=settings.groq_model,
                messages=messages,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        
        except Exception as e:
            logger.error(f"Groq generation error: {e}")
            raise RuntimeError(f"Failed to generate with Groq: {str(e)}")


def build_rag_prompt(query: str, context_chunks: List[Dict]) -> tuple[str, str]:
    """
    Build RAG prompt with retrieved context
    
    Args:
        query: User question
        context_chunks: Retrieved chunks with metadata
    
    Returns:
        Tuple of (system_prompt, user_prompt)
    """
    system_prompt = """You are a helpful study assistant. Your task is to answer questions based ONLY on the provided context from the user's documents.

Rules:
1. Use ONLY the information in the context below
2. If the context doesn't contain enough information to answer, say "I don't have enough information in your documents to answer that. Could you ask about something else or upload more relevant documents?"
3. Be concise but thorough
4. Cite which document/page you're referencing when possible
5. Never make up information or use knowledge outside the provided context"""
    
    # Build context section
    context_parts = []
    for i, chunk in enumerate(context_chunks, 1):
        doc_name = chunk.get("filename", "Unknown")
        page_num = chunk.get("page_number", "N/A")
        text = chunk.get("text", "")
        
        context_parts.append(f"[Source {i} - {doc_name}, Page {page_num}]\n{text}\n")
    
    context_text = "\n".join(context_parts)
    
    user_prompt = f"""Context from documents:
{context_text}

Question: {query}

Answer based only on the context above:"""
    
    return system_prompt, user_prompt
