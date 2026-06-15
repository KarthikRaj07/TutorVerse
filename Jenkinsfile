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
                git 'https://github.com/KarthikRaj07/TutorVerse.git'
            }
        }

        stage('Build Images') {
            steps {
                script {
                    docker.build("${BACKEND_IMAGE}:latest", "./backend")
                    docker.build("${FRONTEND_IMAGE}:latest", "./frontend")
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('', DOCKERHUB_CREDENTIALS) {
                        docker.image("${BACKEND_IMAGE}:latest").push()
                        docker.image("${FRONTEND_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }
    }
}