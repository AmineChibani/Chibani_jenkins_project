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
                    # Install Docker Compose v2
                    DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
                    mkdir -p $DOCKER_CONFIG/cli-plugins
                    curl -SL https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
                    chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
                    
                    # Deploy using Docker Compose
                    docker compose down || true
                    docker compose up -d
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
