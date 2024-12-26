const request = require('supertest');
const app = require('../app');

let server;

describe('Express App Tests', () => {
    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        server = app.listen(0); // Use random available port
    });

    afterAll((done) => {
        server.close(done);
    });

    test('GET / should return hello message', async () => {
        const response = await request(server)
            .get('/')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.message).toBe('Hello Jenkins Pipeline!');
    });

    test('GET /health should return health status', async () => {
        const response = await request(server)
            .get('/health')
            .expect('Content-Type', /json/)
            .expect(200);
        
        expect(response.body.status).toBe('UP');
        expect(response.body.version).toBe('1.0.0');
    });
});
