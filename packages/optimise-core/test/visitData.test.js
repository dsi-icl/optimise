import request from 'supertest';
import message from '../src/utils/message-utils';
import { connectAdmin, connectUser, disconnectAgent } from './connection';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);

beforeAll(async () => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => { //eslint-disable-line no-undef
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Creating VISIT data', () => {
    test('Request creation without body', () => admin
        .post('/data/visit').then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}visitId`);
            return true;
        }));

    test('Request creation without add or update', () => admin
        .post('/data/visit')
        .send({ visitId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}visitId`);
            return true;
        }));

    test('Request creation without visit id', () => admin
        .post('/data/visit')
        .send({ add: { 5: 'BOTH' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}visitId`);
            return true;
        }));

    test('Request creation with invalid value for id', () => admin
        .post('/data/visit')
        .send({ visitId: 99, add: { 1: 'YES' } })
        .then(({ status, body }) => {
            expect(status).toBe(404);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.VISIT);
            return true;
        }));

    test('Request creation with invalid field', () => admin
        .post('/data/visit')
        .send({ visitId: 1, add: { 534567: 'BOTH' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.FIELDNOTFOUND);
            return true;
        }));

    test('Request creation with invalid value for requested field', () => admin
        .post('/data/visit')
        .send({ visitId: 1, add: {} })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.FIELDNOTFOUND);
            return true;
        }));

    test('Request creation with wrong type', () => user
        .post('/data/visit')
        .send({ visitId: 1, add: { 1: 'YES' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.NUMBERFIELD}Systolic Blood Pressure`);
            return true;
        }));


    test('Request creation succesfull', () => user
        .post('/data/visit')
        .send({ visitId: 1, add: { 1: 23 } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));

    test('Request update succesfull', () => admin
        .post('/data/visit')
        .send({ visitId: 1, update: { 1: 41 } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));
});