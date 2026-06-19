pipeline {
    agent any

    triggers {
        githubPush()
        pollSCM('* * * * *')
    }

    environment {
        BACKEND_IMAGE = 'karthikraj07/fastapi-app'
        FRONTEND_IMAGE = 'karthikraj07/react-app'
        
        // Secure injection of secrets and environment variables
        PINECONE_API_KEY = credentials('PINECONE_API_KEY')
        PINECONE_ENV     = 'us-east-1'
        PINECONE_INDEX   = 'tutorverse'
        OLLAMA_BASE_URL  = 'http://localhost:11434'
        OLLAMA_MODEL     = 'mistral'
    }

    stages {
        stage('Clone repo') {
            steps {
                git branch: 'main', url: 'https://github.com/KarthikRaj07/TutorVerse.git'
            }
        }

        stage('Build Docker image') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:latest ./backend"
                sh "docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        stage('Run ingestion') {
            steps {
                echo "Running PDF Ingestion Pipeline (optional)..."
                // Run ingestion inside the built backend container. Fail pipeline if ingestion fails.
                sh """
                docker run --rm --network host \
                  -e RUN_MODE=ingest \
                  -e PINECONE_API_KEY=${PINECONE_API_KEY} \
                  -e PINECONE_ENV=${PINECONE_ENV} \
                  -e PINECONE_INDEX=${PINECONE_INDEX} \
                  -e OLLAMA_BASE_URL=${OLLAMA_BASE_URL} \
                  -e OLLAMA_MODEL=${OLLAMA_MODEL} \
                  ${BACKEND_IMAGE}:latest
                """
            }
        }

        stage('Run backend container') {
            steps {
                echo "Starting backend and frontend services..."
                // Inject environment variables securely during compose deployment
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
                echo "Verifying API server health..."
                // Curl the backend health API endpoint and fail the pipeline if it doesn't respond
                sh """
                for i in {1..10}; do
                    if curl -s -f http://localhost:8000/health > /dev/null; then
                        echo "TutorVerse API is healthy and responding!"
                        exit 0
                    fi
                    echo "Waiting for API to become ready (attempt \$i/10)..."
                    sleep 3
                done
                echo "Error: TutorVerse API is not responding or unhealthy!"
                exit 1
                """
            }
        }
    }
}