const express = require('express');
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'UP',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello Jenkins Pipeline!' });
});

// Only start the server if this file is run directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    });
}

module.exports = app;
