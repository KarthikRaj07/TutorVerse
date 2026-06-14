import os
import uuid
import hashlib
import requests
from typing import List, Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX   = os.getenv("PINECONE_INDEX", "tutorverse")
OLLAMA_URL       = os.getenv("OLLAMA_URL", "http://ollama:11434")
OLLAMA_MODEL     = os.getenv("OLLAMA_MODEL", "llama3")
EMBED_DIM        = 1024  # Must match the existing Pinecone index dimension

# ──────────────────────────────────────────────
# Pinecone client
# ──────────────────────────────────────────────
pc = Pinecone(api_key=PINECONE_API_KEY)

def get_or_create_index():
    existing = [idx.name for idx in pc.list_indexes()]
    if PINECONE_INDEX not in existing:
        pc.create_index(
            name=PINECONE_INDEX,
            dimension=EMBED_DIM,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
    return pc.Index(PINECONE_INDEX)

index = get_or_create_index()

# ──────────────────────────────────────────────
# FastAPI app
# ──────────────────────────────────────────────
app = FastAPI(title="TutorVerse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Pydantic models
# ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    subject: Optional[str] = "general"

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    sources: List[str] = []

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
# Utilities
# ──────────────────────────────────────────────
def text_to_vector(text: str) -> List[float]:
    """
    Simple deterministic pseudo-embedding using SHA-256 hashing.
    Replace with a real embedding model (e.g. sentence-transformers) in production.
    """
    digest = hashlib.sha256(text.encode()).digest()
    # Stretch 32 bytes → 768 floats by repeating and normalising
    raw = list(digest) * (EMBED_DIM // 32 + 1)
    raw = raw[:EMBED_DIM]
    total = sum(raw) or 1
    return [v / total for v in raw]


def ollama_generate(prompt: str) -> str:
    """Call Ollama /api/generate endpoint (non-streaming)."""
    try:
        resp = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=120,
        )
        resp.raise_for_status()
        return resp.json().get("response", "").strip()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Ollama service unavailable")
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Ollama timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")


def retrieve_context(query: str, subject: str, top_k: int = 3):
    """Query Pinecone for similar content."""
    try:
        vec = text_to_vector(query)
        filter_map = {"subject": {"$eq": subject}} if subject != "general" else {}
        results = index.query(vector=vec, top_k=top_k, include_metadata=True, filter=filter_map)
        matches = results.get("matches", [])
        contexts, titles = [], []
        for m in matches:
            meta = m.get("metadata", {})
            if meta.get("content"):
                contexts.append(meta["content"])
            if meta.get("title"):
                titles.append(meta["title"])
        return contexts, titles
    except Exception:
        return [], []

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
    """Store educational content into Pinecone vector database."""
    doc_id = str(uuid.uuid4())
    vec = text_to_vector(req.content)
    index.upsert(
        vectors=[{
            "id": doc_id,
            "values": vec,
            "metadata": {
                "content": req.content[:1000],   # Pinecone metadata limit
                "subject": req.subject,
                "title": req.title,
            },
        }]
    )
    return IngestResponse(id=doc_id, message=f"Ingested '{req.title}' into subject '{req.subject}'")


@app.post("/chat", response_model=ChatResponse, tags=["chat"])
def chat(req: ChatRequest):
    """
    RAG pipeline:
      1. Embed user question
      2. Retrieve top-k context chunks from Pinecone
      3. Build augmented prompt
      4. Generate answer via Ollama llama3
    """
    session_id = req.session_id or str(uuid.uuid4())

    # Step 1 & 2 – Retrieve context
    contexts, sources = retrieve_context(req.message, req.subject)

    # Step 3 – Build prompt
    context_block = "\n\n".join(contexts) if contexts else "No specific study materials found."
    prompt = (
        f"You are TutorVerse, an expert AI tutor. Answer the student's question clearly and concisely.\n"
        f"Subject: {req.subject}\n\n"
        f"Relevant Study Material:\n{context_block}\n\n"
        f"Student Question: {req.message}\n\n"
        f"Tutor Answer:"
    )

    # Step 4 – LLM response
    reply = ollama_generate(prompt)

    return ChatResponse(reply=reply, session_id=session_id, sources=sources)


@app.get("/subjects", tags=["knowledge"])
def list_subjects():
    """List all available subjects."""
    return {
        "subjects": [
            "mathematics", "physics", "chemistry", "biology",
            "history", "geography", "computer_science", "literature",
            "economics", "general"
        ]
    }


@app.delete("/knowledge/{doc_id}", tags=["knowledge"])
def delete_document(doc_id: str):
    """Delete a document from Pinecone by ID."""
    try:
        index.delete(ids=[doc_id])
        return {"message": f"Document {doc_id} deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
