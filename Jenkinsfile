pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'mhdamine48/express-app'
        DOCKER_CREDENTIALS = credentials('docker-credentials')
    }
    stages {
        stage('Build and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-credentials', 
                                                    usernameVariable: 'DOCKER_CREDENTIALS_USR', 
                                                    passwordVariable: 'DOCKER_CREDENTIALS_PSW')]) {
                    sh '''
                        docker build -t $DOCKER_IMAGE .
                        echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin
                        docker push $DOCKER_IMAGE
                        docker logout
                    '''
                }
            }
        }
    }
    post {
        always {
            sh 'docker logout'
        }
    }
}
