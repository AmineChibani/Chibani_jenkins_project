pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        APP_NAME = 'express-app'
        DOCKER_REGISTRY = 'mhdamine48'
    }
    stages {
        stage('Security Scan') {
            steps {
                sh '''
                    npm audit
                    npm audit fix --force || true
                '''
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm install
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
                script {
                    def branchName = env.BRANCH_NAME ?: 'dev'
                    def dockerTag = ''
                    
                    // Determine Docker tag based on branch
                    switch(branchName) {
                        case 'main':
                            dockerTag = 'latest'
                            break
                        case 'staging':
                            dockerTag = 'staging'
                            break
                        default:
                            dockerTag = 'dev'
                    }
                    
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        // Build with specific tag
                        sh """
                            docker build -t ${DOCKER_REGISTRY}/${APP_NAME}:${dockerTag} .
                            echo \$PASSWORD | docker login --username \$USERNAME --password-stdin
                            docker push ${DOCKER_REGISTRY}/${APP_NAME}:${dockerTag}
                            docker logout
                        """
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    def branchName = env.BRANCH_NAME ?: 'dev'
                    def deploymentEnv = ''
                    
                    // Set environment-specific variables
                    switch(branchName) {
                        case 'main':
                            deploymentEnv = 'production'
                            break
                        case 'staging':
                            deploymentEnv = 'staging'
                            break
                        default:
                            deploymentEnv = 'development'
                    }
                    
                    // Load environment-specific variables
                    sh """
                        if [ -f .env.\${deploymentEnv} ]; then
                            source .env.\${deploymentEnv}
                        fi
                        
                        docker-compose -f docker-compose.\${deploymentEnv}.yml down || true
                        docker-compose -f docker-compose.\${deploymentEnv}.yml up -d
                    """
                }
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
