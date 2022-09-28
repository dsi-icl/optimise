import request from 'supertest';
import message from '../src/utils/message-utils';
import { connectAdmin, connectUser, disconnectAgent } from './connection';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);

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
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with bad body (should fail)', () => admin
        .post('/tests')
        .send({ vis: 1, teep: 1, Date: '2020-01-01' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with wrong type visit (should fail)', () => admin
        .post('/tests')
        .send({ visitId: 'WRONG', type: 1, expectedOccurDate: '2020-01-01' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with wrong type type (should fail)', () => admin
        .post('/tests')
        .send({ visitId: 1, type: 'WRONG', expectedOccurDate: '2020-01-01' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with wrong type expectedOccurDate (should fail)', () => admin
        .post('/tests')
        .send({ visitId: 1, type: 1, expectedOccurDate: {} })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with actual occured data with good body (should succeed)', () => admin
        .post('/tests')
        .send({ visitId: 1, type: 1, expectedOccurDate: '2020-01-01', actualOccurredDate: '2020-01-04' })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(5);
            return true;
        }));

    test('Request creation with good body (should succeed)', () => admin
        .post('/tests')
        .send({ visitId: 1, type: 2, expectedOccurDate: '2020-01-01' })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(6);
            return true;
        }));
});

describe('Update test controller tests', () => {
    test('Update a test', () => admin
        .put('/tests')
        .send({ id: 1, type: 3, expectedOccurDate: '2010-01-01', actualOccurredDate: '2010-01-04' })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBe(1);
            return true;
        }));
});

describe('Delete test controller tests', () => {
    test('Request deletion without body (should fail)', () => admin
        .delete('/tests')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion with bad body (should fail)', () => admin
        .delete('/tests')
        .send({ 'visit_-Id': createdTestId })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion with good body by standard user (should succeed)', () => user
        .delete('/tests')
        .send({ testId: 4 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Request deletion with bad ID type (should fail)', () => admin
        .delete('/tests')
        .send({ testId: 'WRONG' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request deletion with bad ID reference (should fail)', () => admin
        .delete('/tests')
        .send({ testId: 99999999 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));

    test('Request deletion with good body (should succeed)', () => admin
        .delete('/tests')
        .send({ testId: 6 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));
});
