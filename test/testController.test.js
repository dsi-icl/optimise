/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const { connectAdmin, connectUser, disconnectAgent } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

let createdTestId;

describe('Create test controller tests', () => {
    test('Request creation without body (should fail)', () => admin
        .post('/tests')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request creation with bad body (should fail)', () => admin
        .post('/tests')
        .send({ 'vis': 1, 'teep': 1, 'Date': '1 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request creation with wrong type visit (should fail)', () => admin
        .post('/tests')
        .send({ 'visitId': 'WRONG', 'type': 1, 'expectedDate': '1 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            expect(res.body.stack).toBeDefined();
            expect(res.body.stack.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with wrong type type (should fail)', () => admin
        .post('/tests')
        .send({ 'visitId': 1, 'type': 'WRONG', 'expectedDate': '1 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            expect(res.body.stack).toBeDefined();
            expect(res.body.stack.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with wrong type expectedDate (should fail)', () => admin
        .post('/tests')
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': {} })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            expect(res.body.stack).toBeDefined();
            expect(res.body.stack.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with actual occured data with good body (should succeed)', () => admin
        .post('/tests')
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': '1 Jan 2020', 'actualOccurredDate': '4 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(4);
        }));

    test('Request creation with good body (should succeed)', () => admin
        .post('/tests')
        .send({ 'visitId': 1, 'type': 2, 'expectedDate': '1 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(5);
        }));
});

describe('Update test controller tests', () => {
    test('Update a test', () => admin
        .put('/tests')
        .send({ 'id': 1, 'type': 3, 'expectedOccurDate': '1 Jan 2010', 'actualOccurredDate': '4 Jan 2010' })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBe(1);
        }));
});

describe('Delete test controller tests', () => {
    test('Request deletion without body (should fail)', () => admin
        .patch('/tests')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request deletion with bad body (should fail)', () => admin
        .patch('/tests')
        .send({ 'visit_-Id': createdTestId })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request deletion with good body by standard User (should fail)', () => user
        .patch('/tests')
        .send({ 'testID': 4 })
        .then(res => {
            expect(res.status).toBe(401);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('Request deletion with bad ID type (should fail)', () => admin
        .patch('/tests')
        .send({ 'testID': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request deletion with bad ID reference (should fail)', () => admin
        .patch('/tests')
        .send({ 'testID': 99999999 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));

    test('Request deletion with good body (should succeed)', () => admin
        .patch('/tests')
        .send({ 'testID': 4 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));
});
