# ──────────────────────────────────────────────────────────────
# TutorVerse — Backend Dockerfile
# Stack: Python 3.12 · FastAPI · Uvicorn · Pinecone · Requests
# ──────────────────────────────────────────────────────────────

FROM python:3.12-slim

# System-level best practices
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Expose required environment variables
ENV PINECONE_API_KEY="" \
    PINECONE_ENV="us-east-1" \
    OLLAMA_BASE_URL="http://ollama:11434" \
    OLLAMA_MODEL="mistral"

WORKDIR /app

# Install dependencies first (leveraging layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source (excluding venv via .dockerignore)
COPY . .

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

EXPOSE 8000

# Entrypoint script supports running either the API server or Ingestion pipeline
ENTRYPOINT ["./entrypoint.sh"]