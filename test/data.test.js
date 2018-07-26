/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const { connectAdmin, connectUser, disconnectAgent } = require('./connection');

beforeAll(async () => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => { //eslint-disable-line no-undef
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Testing data controller in various way', () => {
    test('Requesting a wrong data type', () => admin
        .post('/data/Wrong').then(res => {
            expect(res.status).toBe(404);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGPATH);
        }));

    test('Requesting deletion on clinical event with wrong privilege', () => user
        .delete('/data/clinicalEvent')
        .then(res => {
            expect(res.status).toBe(401);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('Requesting deletion on visit with wrong privilege', () => user
        .delete('/data/visit')
        .then(res => {
            expect(res.status).toBe(401);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('Requesting deletion on test with wrong privilege', () => user
        .delete('/data/test')
        .then(res => {
            expect(res.status).toBe(401);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('Requesting update on test with wrong privilege', () => user
        .delete('/data/test')
        .send({ testId: 1, update: {} })
        .then(res => {
            expect(res.status).toBe(401);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('Requesting update on clinical event with wrong privilege', () => user
        .delete('/data/clinicalEvent')
        .send({ testId: 1, update: {} }).then(res => {
            expect(res.status).toBe(401);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('Requesting update on visit with wrong privilege', () => user
        .delete('/data/visit')
        .send({ testId: 1, update: {} }).then(res => {
            expect(res.status).toBe(401);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

});