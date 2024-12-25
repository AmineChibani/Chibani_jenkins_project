# Jenkins Installation and Pipeline Setup Documentation

## 1. Installing Jenkins

### Prerequisites
- Java 11 or Java 17 (LTS)
- 256 MB RAM minimum, 1 GB+ recommended
- 10 GB of drive space (for Jenkins and Docker images)

### Installation Steps

1. **Install Java (if not installed)**
   - Download OpenJDK 17 from https://adoptium.net/
   - Run the installer
   - Verify installation: `java -version`

2. **Download and Install Jenkins**
   - Go to https://jenkins.io/download/
   - Download Windows installer (.msi)
   - Run the installer
   - Jenkins will install as a Windows service
   - Default port: 8080

3. **Initial Jenkins Setup**
   - Open http://localhost:8080
   - Get initial admin password from:
     ```
     C:\Windows\System32\config\systemprofile\AppData\Local\Jenkins\.jenkins\secrets\initialAdminPassword
     ```
   - Install suggested plugins
   - Create admin user
   - Configure Jenkins URL

4. **Install Required Plugins**
   Go to "Manage Jenkins" > "Manage Plugins" > "Available" and install:
   - Docker Pipeline
   - NodeJS Plugin
   - Git plugin

## 2. Jenkins Pipeline Configuration

### Step 1: Configure Tools
1. Go to "Manage Jenkins" > "Global Tool Configuration"
2. Add NodeJS Installation:
   - Name: "NodeJS"
   - Version: "NodeJS 18.x"
   - Automatic installation

3. Add Docker Installation:
   - Name: "Docker"
   - Install automatically

### Step 2: Configure Credentials
1. Go to "Manage Jenkins" > "Manage Credentials"
2. Add Docker Hub credentials:
   - Kind: Username with password
   - ID: dockerhub-credentials
   - Description: Docker Hub Credentials
   - Username: [Your Docker Hub username]
   - Password: [Your Docker Hub password]

### Step 3: Create Pipeline
1. Click "New Item"
2. Enter name: "Express-App-Pipeline"
3. Select "Pipeline"
4. Click "OK"

### Step 4: Configure Pipeline
1. In Pipeline section, select "Pipeline script from SCM"
2. Select "Git" as SCM
3. Enter your repository URL
4. Specify branch: */main
5. Script Path: Jenkinsfile

## 3. Jenkinsfile Stages Explanation

Our Jenkinsfile contains these stages:

```groovy
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'your-dockerhub-username/express-app'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {
        stage('Checkout') {
            // Checks out source code
        }

        stage('Install') {
            // Installs Node.js dependencies
        }

        stage('Test') {
            // Runs unit tests
        }

        stage('Build Docker') {
            // Builds Docker image
        }

        stage('Push Docker') {
            // Pushes to Docker Hub
        }
    }
}
```

### Stage Details:

1. **Checkout**
   - Clones the repository
   - Ensures fresh code copy

2. **Install**
   - Installs npm dependencies
   - Prepares build environment

3. **Test**
   - Runs Jest unit tests
   - Fails pipeline if tests fail

4. **Build Docker**
   - Creates Docker image
   - Tags with build number

5. **Push Docker**
   - Authenticates with Docker Hub
   - Pushes tagged image
   - Updates latest tag

## 4. Running the Pipeline

1. Go to pipeline dashboard
2. Click "Build Now"
3. View progress in "Stage View"
4. Check console output for details

## 5. Troubleshooting

Common Issues and Solutions:

1. **Jenkins can't find npm**
   - Verify NodeJS plugin installation
   - Check Global Tool Configuration

2. **Docker build fails**
   - Ensure Docker is installed on Jenkins server
   - Check Docker daemon is running
   - Verify Dockerfile syntax

3. **Push to Docker Hub fails**
   - Verify credentials in Jenkins
   - Check Docker Hub permissions
   - Ensure image name format is correct

## 6. Best Practices

1. **Security**
   - Use credentials management
   - Regular security updates
   - Proper permission setup

2. **Pipeline**
   - Keep stages focused
   - Add timeout conditions
   - Include error handling

3. **Docker**
   - Use specific tags
   - Optimize image size
   - Regular cleanup

## 7. Maintenance

Regular Tasks:
1. Update Jenkins plugins
2. Clean up old builds
3. Monitor disk space
4. Review security settings
5. Backup Jenkins configuration
