# ──────────────────────────────────────────────────────────────
# TutorVerse — Optimized Backend Dockerfile
# Stack: Python 3.12 · FastAPI · Uvicorn · Pinecone · Requests
# ──────────────────────────────────────────────────────────────

FROM python:3.12-slim

# System-level configurations to optimize pip performance and stability
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=1000 \
    PIP_RETRIES=10

# Expose required environment variables
ENV PINECONE_API_KEY="" \
    PINECONE_ENV="us-east-1" \
    OLLAMA_BASE_URL="http://ollama:11434" \
    OLLAMA_MODEL="mistral"

WORKDIR /app

# Install system dependencies if required (like curl for docker healthcheck/pip building)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first, leveraging Docker BuildKit cache mount for pip
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Copy application source
COPY . .

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

EXPOSE 8000

# Entrypoint script supports running either the API server or Ingestion pipeline
ENTRYPOINT ["./entrypoint.sh"]