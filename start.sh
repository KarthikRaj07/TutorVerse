#!/bin/bash
# ──────────────────────────────────────────────────────────────
# TutorVerse — Docker start script
# Builds + starts all services, then pulls llama3 into Ollama
# ──────────────────────────────────────────────────────────────

set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║        TutorVerse Docker Setup       ║"
echo "╚══════════════════════════════════════╝"
echo ""

# 1. Build all images
echo "🔨 Building Docker images..."
docker compose build --no-cache

# 2. Start Ollama first so we can pull the model
echo ""
echo "🚀 Starting Ollama service..."
docker compose up -d ollama

# 3. Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
until curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; do
  sleep 2
  printf "."
done
echo ""
echo "✅ Ollama is ready!"

# 4. Pull llama3 model (skips if already downloaded)
echo ""
echo "📦 Pulling llama3 model (this may take a while on first run)..."
docker exec ollama ollama pull llama3
echo "✅ llama3 model ready!"

# 5. Start remaining services
echo ""
echo "🚀 Starting backend and frontend..."
docker compose up -d backend frontend

# 6. Wait for backend health
echo "⏳ Waiting for backend to be healthy..."
until curl -sf http://localhost:8000/health > /dev/null 2>&1; do
  sleep 3
  printf "."
done
echo ""
echo "✅ Backend is healthy!"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║           TutorVerse is LIVE! 🎓             ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Frontend  →  http://localhost:3000          ║"
echo "║  Backend   →  http://localhost:8000          ║"
echo "║  API Docs  →  http://localhost:8000/docs     ║"
echo "║  Ollama    →  http://localhost:11434         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
