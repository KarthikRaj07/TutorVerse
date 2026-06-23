pipeline {
    agent any

    triggers {
        githubPush()
        pollSCM('* * * * *')
    }

    environment {
        BACKEND_IMAGE = 'karthikraj07/fastapi-app'
        FRONTEND_IMAGE = 'karthikraj07/react-app'
        
        // Secure environment variables
        PINECONE_API_KEY = credentials('PINECONE_API_KEY')
        PINECONE_ENV     = 'us-east-1'
        PINECONE_INDEX   = 'tutorverse'
        OLLAMA_BASE_URL  = 'http://localhost:11434'
        OLLAMA_MODEL     = 'mistral'
    }

    stages {
        stage('Clone repo') {
            steps {
                echo "Cloning the TutorVerse repository..."
                git branch: 'main', url: 'https://github.com/KarthikRaj07/TutorVerse.git'
            }
        }

        stage('Build backend Docker') {
            steps {
                echo "Building backend Docker image..."
                sh "export DOCKER_BUILDKIT=1 && docker build -t ${BACKEND_IMAGE}:latest ./backend"
            }
        }

        stage('Build frontend Docker') {
            steps {
                echo "Building frontend Docker image..."
                sh "export DOCKER_BUILDKIT=1 && docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        stage('Run backend container') {
            steps {
                echo "Starting backend and database containers..."
                sh """
                PINECONE_API_KEY=${PINECONE_API_KEY} \
                PINECONE_ENV=${PINECONE_ENV} \
                PINECONE_INDEX=${PINECONE_INDEX} \
                OLLAMA_BASE_URL=${OLLAMA_BASE_URL} \
                OLLAMA_MODEL=${OLLAMA_MODEL} \
                docker compose down || true
                
                PINECONE_API_KEY=${PINECONE_API_KEY} \
                PINECONE_ENV=${PINECONE_ENV} \
                PINECONE_INDEX=${PINECONE_INDEX} \
                OLLAMA_BASE_URL=${OLLAMA_BASE_URL} \
                OLLAMA_MODEL=${OLLAMA_MODEL} \
                docker compose up -d ollama backend
                """
            }
        }

        stage('Run frontend container') {
            steps {
                echo "Starting frontend container..."
                sh """
                PINECONE_API_KEY=${PINECONE_API_KEY} \
                PINECONE_ENV=${PINECONE_ENV} \
                PINECONE_INDEX=${PINECONE_INDEX} \
                OLLAMA_BASE_URL=${OLLAMA_BASE_URL} \
                OLLAMA_MODEL=${OLLAMA_MODEL} \
                docker compose up -d frontend
                """
            }
        }

        stage('Health check') {
            steps {
                echo "Verifying application health..."
                sh """
                echo "Checking backend FastAPI..."
                for i in {1..10}; do
                    if curl -s -f http://localhost:8000/health > /dev/null; then
                        echo "Backend is healthy!"
                        break
                    fi
                    echo "Waiting for backend (attempt \\\$i/10)..."
                    sleep 3
                    if [ \\\$i -eq 10 ]; then
                        echo "Backend failed health check!"
                        exit 1
                    fi
                done

                echo "Checking frontend Nginx..."
                for i in {1..5}; do
                    if curl -s -f http://localhost:3000 > /dev/null; then
                        echo "Frontend is healthy!"
                        exit 0
                    fi
                    echo "Waiting for frontend (attempt \\\$i/5)..."
                    sleep 2
                done
                echo "Frontend failed health check!"
                exit 1
                """
            }
        }
    }
}