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

describe('Creating TEST data', () => {
    test('Request creation without body', () => admin
        .post('/data/test').then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.dataMessage.MISSINGVALUE}testId`);
        }));

    test('Request creation without add or update', () => admin
        .post('/data/test')
        .send({ testId: 1 })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.dataMessage.MISSINGVALUE}testId`);
        }));

    test('Request creation without test id', () => admin
        .post('/data/test')
        .send({ add: { 5: 100 } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.dataMessage.MISSINGVALUE}testId`);
        }));

    test('Request creation with invalid value for id', () => admin
        .post('/data/test')
        .send({ testId: 99, add: { 1: 100 } })
        .then(res => {
            expect(res.status).toBe(404);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.TEST);
        }));

    test('Request creation with invalid field', () => admin
        .post('/data/test')
        .send({ testId: 1, add: { 534567: 10 } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.FIELDNOTFOUND);
        }));

    test('Request creation with invalid value for requested field', () => admin
        .post('/data/test')
        .send({ testId: 1, add: {} })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.FIELDNOTFOUND);
        }));

    test('Request creation with unmatching test and field', () => admin
        .post('/data/test')
        .send({ testId: 1, add: { 35: 120 } })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.dataMessage.INVALIDFIELD);
        }));

    test('Request creation succesfull', () => user
        .post('/data/test')
        .send({ testId: 2, add: { 35: 10 } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));

    test('Request update succesfull', () => admin
        .post('/data/test')
        .send({ testId: 2, update: { 35: 65 } })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.success).toBeDefined();
            expect(res.body.message).toBeDefined();
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(message.dataMessage.SUCCESS);
        }));
});