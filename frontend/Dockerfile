# ──────────────────────────────────────────────────────────────
# TutorVerse — Frontend Dockerfile
# Stack: Node 20 · React 19 · Vite 8 · Tailwind CSS v4
# Multi-stage: build with Node → serve with Nginx (Alpine)
# ──────────────────────────────────────────────────────────────

# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first (better Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy source and build the Vite + React + Tailwind app
COPY . .
RUN npm run build
# Output → /app/dist

# ── Stage 2: Serve with Nginx ────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default nginx config and copy custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]