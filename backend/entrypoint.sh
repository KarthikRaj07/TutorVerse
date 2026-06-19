#!/bin/sh
# Entrypoint script for TutorVerse backend to support both API server and Ingestion pipeline

echo "Starting backend container with RUN_MODE=${RUN_MODE:-api}"

if [ "$RUN_MODE" = "ingest" ]; then
    echo "Running PDF Ingestion Pipeline..."
    python services/ingest_pipeline.py
else
    echo "Running FastAPI Server..."
    exec uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
fi
