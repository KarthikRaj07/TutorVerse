import os
import re
import time
import logging
from typing import List, Tuple, Optional
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.llms import Ollama

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("TutorVerseRAG")

# Load environment variables
load_dotenv()

# Env variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_ENV     = os.getenv("PINECONE_ENV", "us-east-1")
PINECONE_INDEX   = os.getenv("PINECONE_INDEX", "tutorverse")
OLLAMA_URL       = os.getenv("OLLAMA_BASE_URL") or os.getenv("OLLAMA_URL") or "http://ollama:11434"
OLLAMA_MODEL     = os.getenv("OLLAMA_MODEL", "mistral")
EMBED_DIM        = 1024  # Standard for mxbai-embed-large

logger.info(f"Initializing RAG Pipeline with: Ollama URL={OLLAMA_URL}, Model={OLLAMA_MODEL}")

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)
index = None

def get_or_create_index():
    global index
    if index is not None:
        return index
    existing = [idx.name for idx in pc.list_indexes()]
    if PINECONE_INDEX not in existing:
        logger.info(f"Creating Pinecone index: {PINECONE_INDEX}")
        pc.create_index(
            name=PINECONE_INDEX,
            dimension=EMBED_DIM,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region=PINECONE_ENV),
        )
    index = pc.Index(PINECONE_INDEX)
    return index

# Embeddings model
embeddings_model = OllamaEmbeddings(
    model="mxbai-embed-large",
    base_url=OLLAMA_URL
)

# Ollama LLM wrapper with low temperature (0.2)
llm = Ollama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_URL,
    temperature=0.2
)

def clean_query(query: str) -> str:
    """Cleans and normalizes the user query."""
    if not query:
        return ""
    # Strip spaces and normalize whitespace
    query = query.strip()
    query = re.sub(r"\s+", " ", query)
    return query

def detect_mode(query: str) -> str:
    """Detects mode from query: exam, simple, or normal."""
    query_lower = query.lower()
    
    # Exam mode triggers
    exam_patterns = [
        r"\b\d+\s*marks?\s*answers?\b",
        r"\b\d+\s*-\s*marks?\s*answers?\b",
        r"\bbullet\s*answers?\b",
        r"\bbulleted\s*answers?\b",
        r"\bbullet\s*points?\b"
    ]
    for pattern in exam_patterns:
        if re.search(pattern, query_lower):
            return "exam"
            
    # Simple mode triggers
    simple_patterns = [
        r"\bexplain\b.*\bsimply\b",
        r"\bexplain\b.*\bsimple\b",
        r"\bsimple\s*explanation\b",
        r"\bexplain\b.*\bweak\b"
    ]
    for pattern in simple_patterns:
        if re.search(pattern, query_lower):
            return "simple"
            
    return "normal"

def validate_subject(subject: str, query: str) -> bool:
    """
    Validates if the user query matches the selected subject.
    Strict enforcement: If subject is 'computer_science', do not allow English queries.
    """
    if not subject:
        return True
        
    normalized_subject = subject.lower().replace(" ", "_")
    if normalized_subject == "computer_science":
        # Heuristics for English queries (grammar, literature, etc.)
        english_keywords = [
            "noun", "verb", "adjective", "pronoun", "adverb", "preposition", "conjunction", "interjection",
            "grammar", "tense", "punctuation", "shakespeare", "poem", "poetry", "poet", "sonnet", "prose",
            "novel", "literature", "synonym", "antonym", "spelling", "sentence", "comprehension", "clause",
            "metaphor", "simile", "alliteration", "personification", "idiom", "active voice", "passive voice",
            "direct speech", "indirect speech"
        ]
        query_lower = query.lower()
        for kw in english_keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', query_lower):
                return False
                
        # Fast backup LLM classification
        try:
            prompt = (
                f"You are a classification assistant. Is the following student query specifically about the subject 'English' (such as English grammar, language, or literature)?\n"
                f"Query: \"{query}\"\n"
                f"Reply with ONLY 'yes' or 'no'."
            )
            # Use low temperature for deterministic classification
            classifier = Ollama(model=OLLAMA_MODEL, base_url=OLLAMA_URL, temperature=0.0)
            response = classifier.invoke(prompt).strip().lower()
            if "yes" in response:
                return False
        except Exception as e:
            logger.warning(f"Subject validation LLM fallback failed: {e}")
            
    return True

def text_to_vector(text: str) -> List[float]:
    """Embed text using LangChain OllamaEmbeddings."""
    return embeddings_model.embed_query(text)

def retrieve_context(query: str, subject: str, top_k: int = 5) -> Tuple[List[str], List[str]]:
    """
    Query Pinecone for similar content using subject-based namespace partitioning
    and metadata filtering.
    """
    try:
        idx = get_or_create_index()
        vec = text_to_vector(query)
        
        # Determine namespace: partition by subject (e.g. computer_science, english)
        namespace = subject.lower().replace(" ", "_") if subject else "general"
        
        # Filter metadata to strictly enforce subject match
        filter_map = {"subject": {"$eq": subject}} if subject and subject != "general" else {}
        
        results = idx.query(
            vector=vec, 
            top_k=top_k, 
            include_metadata=True, 
            filter=filter_map if filter_map else None,
            namespace=namespace
        )
        matches = results.get("matches", [])
        contexts, titles = [], []
        for m in matches:
            meta = m.get("metadata", {})
            if meta.get("content"):
                contexts.append(meta["content"])
            if meta.get("title"):
                titles.append(meta["title"])
        return contexts, titles
    except Exception as e:
        logger.error(f"Error during Pinecone retrieval: {e}")
        return [], []

def build_prompt(mode: str, subject: str, context_block: str, query: str) -> str:
    """Builds prompt templates with strict instructions."""
    if mode == "exam":
        instruction = "Provide a concise, highly structured, and direct answer suitable for exam scoring."
    elif mode == "simple":
        instruction = "Provide a step-by-step explanation using extremely simple English."
    else:  # normal
        instruction = "Provide a clear and comprehensive explanation of moderate length."

    prompt = (
        f"You are TutorVerse, an expert AI tutor.\n"
        f"Subject: {subject}\n"
        f"Mode: {mode}\n\n"
        f"Instructions:\n"
        f"- Answer ONLY from the given context.\n"
        f"- Do NOT use external knowledge.\n"
        f"- If answer not found, say: Not in syllabus.\n"
        f"- {instruction}\n\n"
        f"Given Context:\n{context_block}\n\n"
        f"Student Query: {query}\n\n"
        f"Tutor Answer:"
    )
    return prompt

def run_rag_pipeline(query: str, subject: str, mode: str) -> str:
    """
    Complete RAG pipeline:
      1. Normalizes the query
      2. Validates the subject against query content
      3. Retrieves related context chunks from Pinecone
      4. Builds structured context with duplicate removal & token limit
      5. Runs Ollama LLM with customized prompt
    """
    start_time = time.time()
    
    # 1. Clean query
    cleaned = clean_query(query)
    
    # 2. Subject validation
    if not validate_subject(subject, cleaned):
        logger.warning(f"Subject validation failed: query='{cleaned}', subject='{subject}'")
        # Log requirements
        logger.info(f"RAG Request Completed: count=0, subject={subject}, mode={mode}, time={time.time() - start_time:.4f}s")
        return "This question is outside the selected subject"
        
    # 3. Retrieval
    contexts, titles = retrieve_context(cleaned, subject, top_k=5)
    
    # 4. Failure handling: No context retrieved
    if not contexts:
        logger.info(f"No context retrieved for query: '{cleaned}' under subject '{subject}'")
        # Log requirements
        logger.info(f"RAG Request Completed: count=0, subject={subject}, mode={mode}, time={time.time() - start_time:.4f}s")
        return "Not in syllabus"
        
    # 5. Context optimization (remove duplicate chunks and enforce token limit)
    seen = set()
    unique_contexts = []
    current_char_count = 0
    max_chars = 12000  # Approx 3000 tokens limit to prevent context overload
    
    for ctx in contexts:
        stripped_ctx = ctx.strip()
        if stripped_ctx not in seen:
            seen.add(stripped_ctx)
            # Check length limit
            if current_char_count + len(stripped_ctx) < max_chars:
                unique_contexts.append(stripped_ctx)
                current_char_count += len(stripped_ctx)
            else:
                break
                
    context_block = "\n\n".join(unique_contexts)
    
    # 6. Prompt Engineering
    prompt = build_prompt(mode, subject, context_block, cleaned)
    
    # 7. LLM Response generation
    try:
        answer = llm.invoke(prompt).strip()
    except Exception as e:
        logger.error(f"Ollama generation failed: {e}")
        answer = "Error generating response from LLM."
        
    # 8. Performance logging
    elapsed = time.time() - start_time
    logger.info(f"RAG Request Completed: count={len(unique_contexts)}, subject={subject}, mode={mode}, time={elapsed:.4f}s")
    
    return answer
