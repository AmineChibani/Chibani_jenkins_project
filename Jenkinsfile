pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        APP_NAME = 'express-app'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'mhdamine48/express-app'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                sh '''
                    npm install
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                    npm test
                '''
            }
            post {
                always {
                    junit 'junit.xml'
                }
            }
        }
        stage('Build and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                        docker build -t $DOCKER_IMAGE:latest .
                        echo $PASSWORD | docker login --username $USERNAME --password-stdin
                        docker push $DOCKER_IMAGE:latest
                        docker logout
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                    docker-compose down || true
                    docker-compose up -d
                '''
            }
        }
    }
    post {
        success {
            echo 'Pipeline succeeded! Application is deployed.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for details.'
        }
        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
