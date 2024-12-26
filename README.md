# 🚀 Express App with Jenkins CI/CD

This project demonstrates a complete CI/CD pipeline using Jenkins, Docker, and Express.js.

## 📋 Features

- 🧪 Automated testing
- 🐳 Docker containerization
- 🔷 Continuous Integration with Jenkins
- 🚀 Automated deployment
- 🏥 Health monitoring endpoint

## 📋 Prerequisites

- 🟢 Node.js
- 🐳 Docker
- 🔷 Jenkins
- 📊 Docker Hub account

## 🚀 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Start the application:
   ```bash
   npm start
   ```

## 🔄 Docker Commands

Build the image:
```bash
docker build -t mhdamine48/express-app .
```

Run the container:
```bash
docker run -p 3000:3000 mhdamine48/express-app
```

## 🌐 API Endpoints

- 🔗 **GET** `/`: Returns a hello message
- 🔗 **GET** `/health`: Returns application health status

## 🔄 CI/CD Pipeline

The Jenkins pipeline includes:
1. Running tests
2. Building Docker image
3. Pushing to Docker Hub
4. Deploying the application

## 🏥 Monitoring

Access the health endpoint at: `http://localhost:3000/health`