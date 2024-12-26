pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }
    stages {
        stage('Build and Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Docker Build and Push') {
            steps {
                script {
                    try {
                        // Build the image
                        sh 'docker build -t mhdamine48/express-app .'
                        
                        // Login to DockerHub
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                            sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                            sh 'docker push mhdamine48/express-app'
                        }
                    } finally {
                        sh 'docker logout'
                    }
                }
            }
        }
    }
}
