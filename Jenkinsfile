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
        stage('Clone') {
            steps {
                echo "Cloning the TutorVerse repository..."
                git branch: 'main', url: 'https://github.com/KarthikRaj07/TutorVerse.git'
            }
        }

        stage('Build Docker image') {
            steps {
                echo "Building backend and frontend Docker images..."
                // Enable Docker BuildKit for advanced caching during docker build
                sh """
                export DOCKER_BUILDKIT=1
                docker build -t ${BACKEND_IMAGE}:latest ./backend
                docker build -t ${FRONTEND_IMAGE}:latest ./frontend
                """
            }
        }

        stage('Run container') {
            steps {
                echo "Starting TutorVerse containers via Docker Compose..."
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
                docker compose up --build -d
                """
            }
        }

        stage('Health check') {
            steps {
                echo "Verifying backend FastAPI application health..."
                sh """
                for i in {1..10}; do
                    if curl -s -f http://localhost:8000/health > /dev/null; then
                        echo "API is healthy and running!"
                        exit 0
                    fi
                    echo "Waiting for API to become ready (attempt \$i/10)..."
                    sleep 3
                done
                echo "Error: API failed health check!"
                exit 1
                """
            }
        }
    }
}