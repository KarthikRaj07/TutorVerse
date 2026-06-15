pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
        BACKEND_IMAGE = 'KarthikRaj07/fastapi-app'
        FRONTEND_IMAGE = 'KarthikRaj07/react-app'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/KarthikRaj07/TutorVerse.git'
            }
        }

        stage('Build Images') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:latest ./backend"
                sh "docker build -t ${FRONTEND_IMAGE}:latest ./frontend"
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                cd /home/karthiii/Documents/TutorVerse
                git pull origin main
                docker compose down || true
                docker compose up --build -d
                '''
            }
        }
    }
}