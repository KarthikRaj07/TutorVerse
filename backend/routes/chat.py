import uuid
import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.rag_pipeline import (
    detect_mode,
    run_rag_pipeline,
    retrieve_context,
    logger
)

router = APIRouter()

# ──────────────────────────────────────────────
# Pydantic models with compatibility
# ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    query: Optional[str] = None
    message: Optional[str] = None  # Frontend sends 'message'
    subject: Optional[str] = "general"
    session_id: Optional[str] = None  # Frontend compatibility

class ChatResponse(BaseModel):
    answer: str
    reply: str  # Frontend compatibility (maps to answer)
    mode: str
    subject: str
    session_id: str  # Frontend compatibility
    sources: List[str] = []  # Frontend compatibility

# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@router.post("/chat", response_model=ChatResponse, tags=["chat"])
def chat(req: ChatRequest):
    """
    Handles student chat requests by detecting mode, running the
    RAG pipeline, and returning the structured answer.
    """
    query_text = req.query or req.message
    if not query_text:
        raise HTTPException(status_code=400, detail="Either 'query' or 'message' field must be provided.")
        
    subject = req.subject or "general"
    session_id = req.session_id or str(uuid.uuid4())
    
    # 1. Detect mode
    mode = detect_mode(query_text)
    
    # 2. Run RAG pipeline
    answer = run_rag_pipeline(query_text, subject, mode)
    
    # 3. Retrieve sources/titles for frontend citation list
    _, sources = retrieve_context(query_text, subject)
    
    # Clean duplicates in sources/citations
    seen_sources = []
    for s in sources:
        if s not in seen_sources:
            seen_sources.append(s)
            
    return ChatResponse(
        answer=answer,
        reply=answer,  # Frontend mapping
        mode=mode,
        subject=subject,
        session_id=session_id,
        sources=seen_sources
    )
