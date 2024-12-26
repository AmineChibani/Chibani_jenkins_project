pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'mhdamine48/express-app'
        APP_PORT = '3000'
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
                    # Remove the existing container if it exists
                    docker rm -f express-app || true
                    
                    # Pull the latest image
                    docker pull $DOCKER_IMAGE:latest
                    
                    # Run the new container
                    docker run -d \
                        --name express-app \
                        -p $APP_PORT:3000 \
                        --restart unless-stopped \
                        $DOCKER_IMAGE:latest
                        
                    # Wait for container to start
                    sleep 10
                    
                    # Check if container is running
                    docker ps | grep express-app || (echo "Container failed to start" && exit 1)
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
            sh '''
                # Cleanup on failure
                docker rm -f express-app || true
            '''
        }
        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
