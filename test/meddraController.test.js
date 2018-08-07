/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const { connectAdmin, connectUser, disconnectAgent } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Fetching MeDRA codes', () => {
    test('Search by name', () => admin
        .get('/meddra?search=nonhaemolytic')
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body).toBeDefined();
            expect(res.body).toHaveLength;
            expect(res.body.length).toBe(3);
            return true;
        }));

    test('Search by code', () => admin
        .get('/meddra?search=2086')
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body).toBeDefined();
            expect(res.body).toHaveLength;
            expect(res.body.length).toBe(8);
            return true;
        }));

    test('Get children from parent', () => admin
        .get('/meddra?parent=32529')
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body).toBeDefined();
            expect(res.body).toHaveLength;
            expect(res.body.length).toBe(11);
            return true;
        }));

    test('Get children from non existing parent', () => admin
        .get('/meddra?parent=xoxox')
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body).toBeDefined();
            expect(res.body).toHaveLength;
            expect(res.body.length).toBe(0);
            return true;
        }));
});