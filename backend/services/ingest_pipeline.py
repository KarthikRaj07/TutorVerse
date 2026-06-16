import os
import re
import sys
import uuid
import requests
from typing import List, Optional
import dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_core.documents import Document

# Adjust python path if run directly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from utils.pdf_loader import load_pdf
from utils.pdf_cleaner import clean_document
from utils.chunker import chunk_documents

# Load environment variables
dotenv.load_dotenv(os.path.join(parent_dir, ".env"))

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_INDEX   = os.getenv("PINECONE_INDEX", "tutorverse")
OLLAMA_URL       = os.getenv("OLLAMA_URL", "http://localhost:11434")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

def get_index():
    """Gets the Pinecone index, creating it if it doesn't exist."""
    existing_indexes = [idx.name for idx in pc.list_indexes()]
    if PINECONE_INDEX not in existing_indexes:
        print(f"Creating Pinecone index '{PINECONE_INDEX}'...")
        pc.create_index(
            name=PINECONE_INDEX,
            dimension=1024,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
    return pc.Index(PINECONE_INDEX)

def get_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """Gets embeddings for a batch of texts from Ollama's mxbai-embed-large model."""
    if not texts:
        return []
    
    try:
        resp = requests.post(
            f"{OLLAMA_URL}/api/embed",
            json={"model": "mxbai-embed-large", "input": texts},
            timeout=120,
        )
        resp.raise_for_status()
        return resp.json().get("embeddings", [])
    except Exception as e:
        print(f"Error calling batch embedding: {e}. Falling back to single embedding queries.")
        embeddings = []
        for text in texts:
            try:
                resp_single = requests.post(
                    f"{OLLAMA_URL}/api/embed",
                    json={"model": "mxbai-embed-large", "input": [text]},
                    timeout=30,
                )
                resp_single.raise_for_status()
                emb = resp_single.json().get("embeddings", [[]])[0]
                embeddings.append(emb)
            except Exception as e_single:
                print(f"Failed to embed text: {text[:50]}... Error: {e_single}. Using fallback vector.")
                # Fallback placeholder vector of size 1024
                import hashlib
                digest = hashlib.sha256(text.encode()).digest()
                raw = list(digest) * 32
                raw = raw[:1024]
                total = sum(raw) or 1
                embeddings.append([v / total for v in raw])
        return embeddings

def detect_subject(filename: str) -> str:
    """Detects subject from the PDF filename."""
    lower_name = filename.lower()
    if "computer" in lower_name or re.search(r'(?:^|[^a-zA-Z])cs(?:[^a-zA-Z]|$)', lower_name):
        return "computer_science"
    elif "english" in lower_name:
        return "english"
    return "general"

def extract_chapter(text: str) -> Optional[str]:
    """Tries to extract a chapter heading from text using regex."""
    # Matches "Chapter 1", "CHAPTER 1", "Chapter - 1", "Chapter 01", etc.
    match = re.search(r'\b(?:chapter|chap\.?)\s*[-:]?\s*(\d+)', text, re.IGNORECASE)
    if match:
        return f"Chapter {match.group(1)}"
    # Also Roman numerals: "Chapter IV" or "CHAPTER IV"
    roman_match = re.search(r'\b(?:chapter|chap\.?)\s*[-:]?\s*\b([ivxldcm]+)\b', text, re.IGNORECASE)
    if roman_match:
        return f"Chapter {roman_match.group(1).upper()}"
    return None

def extract_topic(text: str) -> Optional[str]:
    """Tries to extract a topic from text headings."""
    lines = text.split("\n")
    for line in lines:
        stripped = line.strip()
        # Look for headings like "1.2 Python Basics" or "10.4 Web Servers"
        if re.match(r'^\d+\.\d+\s+[A-Za-z]', stripped):
            return stripped
        # Look for short uppercase headings (excluding common non-topic words)
        if 5 < len(stripped) < 60 and stripped.isupper():
            if not any(kw in stripped.lower() for kw in ["contents", "preface", "index", "chapter"]):
                return stripped
    return None

def ingest_pdf(file_path: str) -> List[Document]:
    """
    Ingests a single PDF: loads, cleans, chunks, extracts metadata,
    embeds, and uploads to Pinecone under a subject namespace.
    """
    filename = os.path.basename(file_path)
    print(f"\nProcessing {filename}...")
    
    # 1. Loading PDF
    print("Loading PDF...")
    raw_docs = load_pdf(file_path)
    
    # 2. Cleaning
    print("Cleaning...")
    cleaned_docs = [clean_document(doc) for doc in raw_docs]
    
    # Metadata extraction
    subject = detect_subject(filename)
    enriched_docs = []
    current_chapter = None
    current_topic = None
    
    for idx, doc in enumerate(cleaned_docs):
        page_num = idx + 1
        
        # Try to extract chapter / topic from this page's text
        extracted_chap = extract_chapter(doc.page_content)
        extracted_top = extract_topic(doc.page_content)
        
        if extracted_chap:
            current_chapter = extracted_chap
        if extracted_top:
            current_topic = extracted_top
            
        doc.metadata["subject"] = subject
        doc.metadata["source"] = filename
        doc.metadata["page"] = page_num
        if current_chapter:
            doc.metadata["chapter"] = current_chapter
        if current_topic:
            doc.metadata["topic"] = current_topic
            
        # Create a descriptive title
        if current_chapter and current_topic:
            doc.metadata["title"] = f"{current_chapter} - {current_topic}"
        elif current_chapter:
            doc.metadata["title"] = current_chapter
        else:
            doc.metadata["title"] = f"{filename} Page {page_num}"
            
        enriched_docs.append(doc)
        
    # 3. Chunking
    print("Chunking...")
    chunks = chunk_documents(enriched_docs)
    
    # 4. Uploading to Pinecone
    print("Uploading to Pinecone...")
    index = get_index()
    
    batch_size = 50
    total_chunks = len(chunks)
    
    for i in range(0, total_chunks, batch_size):
        batch_chunks = chunks[i : i + batch_size]
        batch_texts = [c.page_content for c in batch_chunks]
        
        # Batch embed via Ollama
        batch_embs = get_batch_embeddings(batch_texts)
        
        vectors_to_upsert = []
        for j, chunk in enumerate(batch_chunks):
            if j < len(batch_embs):
                emb = batch_embs[j]
            else:
                continue
                
            doc_id = f"{subject}_{uuid.uuid4().hex}"
            
            meta = {
                "content": chunk.page_content,
                "subject": chunk.metadata.get("subject", subject),
                "source": chunk.metadata.get("source", filename),
                "page": int(chunk.metadata.get("page", 1)),
                "title": chunk.metadata.get("title", filename)
            }
            if chunk.metadata.get("chapter"):
                meta["chapter"] = chunk.metadata["chapter"]
            if chunk.metadata.get("topic"):
                meta["topic"] = chunk.metadata["topic"]
                
            vectors_to_upsert.append({
                "id": doc_id,
                "values": emb,
                "metadata": meta
            })
            
        if vectors_to_upsert:
            index.upsert(vectors=vectors_to_upsert, namespace=subject)
            
        print(f"Uploaded {min(i + batch_size, total_chunks)}/{total_chunks} chunks...")
        
    print(f"Successfully processed and uploaded {filename} to namespace '{subject}'.")
    return chunks

def ingest_all_pdfs():
    """Automatically loads all PDFs from the backend/data folder and runs ingestion."""
    data_dir = os.path.join(parent_dir, "data")
    if not os.path.exists(data_dir):
        print(f"Error: Data directory not found at {data_dir}")
        return
        
    pdf_files = [f for f in os.listdir(data_dir) if f.lower().endswith(".pdf")]
    if not pdf_files:
        print(f"No PDF files found in {data_dir}")
        return
        
    print(f"Found {len(pdf_files)} PDF files in {data_dir}: {pdf_files}")
    
    all_chunks = []
    for pdf_file in pdf_files:
        pdf_path = os.path.join(data_dir, pdf_file)
        try:
            chunks = ingest_pdf(pdf_path)
            all_chunks.extend(chunks)
        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")
            import traceback
            traceback.print_exc()
            
    print(f"\nIngestion pipeline complete. Total chunks created and uploaded: {len(all_chunks)}")

if __name__ == "__main__":
    ingest_all_pdfs()
