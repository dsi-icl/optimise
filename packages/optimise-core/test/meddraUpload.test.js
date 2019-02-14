/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const { connectAdmin, disconnectAgent } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
});

afterAll(async () => {
    await disconnectAgent(admin);
});

describe('Meddra upload tests', () => {
    test('Initially the meddra code database is empty', () => admin
        .get('/meddra')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
            return true;
        })
    );

    test('Uploading mdhier.asc', () => admin
        .post('/uploadMeddra')
        .attach('mdhierfile', './test/seed/mdhier.asc')
        .then(res => {
            expect(res.statusCode).toBe(200);
            return true;
        })
    );

    test('meddra code database is filled', () => admin
        .get('/meddra')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(8);
            return true;
        })
    );

});