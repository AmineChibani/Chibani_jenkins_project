pipeline {
    agent any
    environment {
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
        stage('Security Scan') {
            steps {
                sh '''
                    npm audit
                    npm audit fix --force || true
                '''
            }
        }
        stage('Test') {
            steps {
                sh '''
                    mkdir -p reports
                    JEST_JUNIT_OUTPUT_DIR=./reports JEST_JUNIT_OUTPUT_NAME=junit.xml npm test -- --ci --reporters=default --reporters=jest-junit
                '''
            }
            post {
                always {
                    junit 'reports/junit.xml'
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
                    # Stop and remove existing containers
                    docker ps -aq | xargs -r docker stop
                    docker ps -aq | xargs -r docker rm
                    
                    # Remove existing app container if it exists
                    docker rm -f express-app || true
                    
                    # Run the new container
                    docker run -d --name express-app -p 3000:3000 $DOCKER_IMAGE:latest
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
