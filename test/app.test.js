const request = require('supertest');
const app = require('../app');

describe('Express App Tests', () => {
    test('GET / should return hello message', async () => {
        const response = await request(app)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe('Hello Jenkins Pipeline!');
    });

    test('GET /health should return health status', async () => {
        const response = await request(app)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.status).toBe('UP');
        expect(response.body.version).toBe('1.0.0');
    });
});
