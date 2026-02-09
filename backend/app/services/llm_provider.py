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
                temperature=0.5,  # Lower for more accurate, focused responses
                max_tokens=2048,  # Reasonable limit for study responses
                top_p=0.9,  # Nucleus sampling for quality
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
    # Get unique document names for citation
    doc_names = list(set(chunk.get("filename", "document").replace(".pdf", "").replace(".txt", "") for chunk in context_chunks))
    doc_tag = doc_names[0] if doc_names else "document"
    
    system_prompt = f"""You are Bro, an advanced AI study assistant with deep expertise in synthesizing and explaining complex study materials.

CORE PRINCIPLES:
1. **Accuracy First**: Only state facts that are explicitly supported by the provided documents. If information isn't in the context, say so clearly.
2. **Synthesize Intelligently**: Connect related concepts from different parts of the documents to give a complete picture.
3. **Think Step-by-Step**: For complex questions, break down your reasoning before giving the final answer.
4. **Be Precise**: Use exact terminology from the documents. Define technical terms when first used.
5. **Admit Uncertainty**: If the documents don't fully answer the question, clearly state what's missing.

RESPONSE FORMAT:
1. Start with a direct, concise answer to the question
2. Use **bold text** for section titles (NEVER use # or ## headers)
3. Use bullet points (•) for key points
4. Bold (**text**) important terms and definitions
5. Add citation tags after key facts: 📄 {doc_tag}

ANSWER STRUCTURE:
**Direct Answer**
Provide a clear, direct answer to the question first. 📄 {doc_tag}

**Key Concepts**
• **Term 1** - precise definition from documents
• **Term 2** - precise definition from documents
📄 {doc_tag}

**Detailed Explanation**
Expand on the answer with supporting details from the documents. Connect related ideas. 📄 {doc_tag}

**Important Relationships** (if applicable)
Explain how concepts relate to each other. 📄 {doc_tag}

CRITICAL RULES:
- NEVER use # or ## for headers - use **bold text** only
- Start with the most important information (inverted pyramid)
- Be comprehensive but concise - no filler content
- Use exact quotes when precision matters (put in "quotation marks")
- If the question has multiple parts, address each part explicitly
- For definitions, be precise - use the document's exact wording
- For explanations, synthesize multiple chunks into a coherent narrative
- Don't repeat information - each point should add new value
- Use simple language to explain complex concepts"""
    
    # Build context section
    context_parts = []
    for i, chunk in enumerate(context_chunks, 1):
        doc_name = chunk.get("filename", "Unknown")
        text = chunk.get("text", "")
        context_parts.append(f"[{doc_name}]\n{text}\n")
    
    context_text = "\n---\n".join(context_parts)
    
    user_prompt = f"""Reference material from documents:

{context_text}

---

User's question: {query}

Provide a comprehensive, insightful response that helps the user deeply understand this topic. Use appropriate formatting for clarity."""
    
    return system_prompt, user_prompt

