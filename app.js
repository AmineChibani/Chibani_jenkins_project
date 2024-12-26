const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date(),
        uptime: process.uptime(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from  Jenkins Pipeline!' });

    res.json({ 
        message: 'Hello Jenkins Pipeline!',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date()
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
