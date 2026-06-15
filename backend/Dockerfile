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

WORKDIR /app

# Install deps first (layer cache: only re-runs when requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source (excludes venv via .dockerignore)
COPY main.py .
COPY .env .

EXPOSE 8000

# Run with Uvicorn — workers=1 keeps it simple for a single container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]