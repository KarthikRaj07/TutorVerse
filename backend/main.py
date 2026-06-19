import os
import uuid
import requests
from typing import List, Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from services.rag_pipeline import (
    pc,
    OLLAMA_URL,
    get_or_create_index,
    text_to_vector
)
from routes.chat import router as chat_router

load_dotenv()

# ──────────────────────────────────────────────
# FastAPI app setup with lifespan
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize index on startup
    try:
        get_or_create_index()
        print("Pinecone index initialized")
    except Exception as e:
        print(f"Warning: Failed to initialize Pinecone index at startup: {e}")
    yield

app = FastAPI(title="TutorVerse API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Chat router
app.include_router(chat_router)

# ──────────────────────────────────────────────
# Pydantic models for other endpoints
# ──────────────────────────────────────────────
class IngestRequest(BaseModel):
    content: str
    subject: str
    title: str

class IngestResponse(BaseModel):
    id: str
    message: str

class HealthResponse(BaseModel):
    status: str
    pinecone: str
    ollama: str

# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.get("/", tags=["root"])
def root():
    return {"message": "TutorVerse API is running 🚀"}


@app.get("/health", response_model=HealthResponse, tags=["health"])
def health_check():
    # Pinecone check
    try:
        pc.list_indexes()
        pinecone_status = "connected"
    except Exception as e:
        pinecone_status = f"error: {str(e)}"

    # Ollama check
    try:
        resp = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        ollama_status = "connected" if resp.ok else f"http {resp.status_code}"
    except Exception:
        ollama_status = "unavailable"

    return HealthResponse(
        status="ok",
        pinecone=pinecone_status,
        ollama=ollama_status,
    )


@app.post("/ingest", response_model=IngestResponse, tags=["knowledge"])
def ingest_content(req: IngestRequest):
    """Store educational content into Pinecone vector database under the appropriate namespace."""
    idx = get_or_create_index()
    doc_id = str(uuid.uuid4())
    vec = text_to_vector(req.content)
    namespace = req.subject if req.subject else "general"
    idx.upsert(
        vectors=[{
            "id": doc_id,
            "values": vec,
            "metadata": {
                "content": req.content,
                "subject": req.subject,
                "title": req.title,
            },
        }],
        namespace=namespace
    )
    return IngestResponse(
        id=doc_id, 
        message=f"Ingested '{req.title}' into subject '{req.subject}' under namespace '{namespace}'"
    )


@app.get("/subjects", tags=["knowledge"])
def list_subjects():
    """List all available subjects."""
    return {
        "subjects": [
            "mathematics", "physics", "chemistry", "biology",
            "history", "geography", "computer_science", "english", "literature",
            "economics", "general"
        ]
    }


@app.delete("/knowledge/{doc_id}", tags=["knowledge"])
def delete_document(doc_id: str):
    """Delete a document from Pinecone by ID."""
    try:
        idx = get_or_create_index()
        # Delete from all namespaces or general by default if not parameterized
        idx.delete(ids=[doc_id])
        return {"message": f"Document {doc_id} deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
