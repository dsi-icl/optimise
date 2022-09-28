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

describe('Creating CE data', () => {
    test('Request creation without body', () => admin
        .post('/data/clinicalEvent').then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}clinicalEventId`);
            return true;
        }));

    test('Request creation without add or update', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}clinicalEventId`);
            return true;
        }));

    test('Request creation without clinicalEvent id', () => admin
        .post('/data/clinicalEvent')
        .send({ add: { 5: 'BOTH' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}clinicalEventId`);
            return true;
        }));

    test('Request creation with invalid value for id', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 99, add: { 1: 'YES' } })
        .then(({ status, body }) => {
            expect(status).toBe(404);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.CLINICALEVENT);
            return true;
        }));

    test('Request creation with invalid field', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: { 534567: 'BOTH' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.FIELDNOTFOUND);
            return true;
        }));

    test('Request creation with invalid value for requested field', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: {} })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.FIELDNOTFOUND);
            return true;
        }));

    test('Request creation succesfull', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: { 1: 'YES' } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));

    test('Request update succesfull (as admin)', () => admin
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, update: { 1: 'NO' } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));

    test('Request creation of incompatible reference type and parent clinical event', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 1, add: { 18: 'We do not know' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.INVALIDFIELD);
            return true;
        }));

    test('Request creation successfull (as user)', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 18: 'We do not know' } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));

    test('Request update succesfull (as user)', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 18: 'We do not know a lot' } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));

    test('Request creation with wrong type', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 17: 'Not a date' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.userError.INVALIDDATE} at field Date of discharge`);
            return true;
        }));

    test('Request creation with wrong none ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 17: '2018/10/10' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.userError.INVALIDDATE} at field Date of discharge`);
            return true;
        }));

    test('Request creation with correct ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, add: { 17: '2013-02-04T22:44:30.652Z' } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));

    test('Request update with wrong none ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 17: '2017/10/10' } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.userError.INVALIDDATE} at field Date of discharge`);
            return true;
        }));

    test('Request update with correct ISO date format', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 17: '2013-02-04T22:44:30.652Z' } })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.success).toBeDefined();
            expect(body.message).toBeDefined();
            expect(body.success).toBe(true);
            expect(body.message).toBe(message.dataMessage.SUCCESS);
            return true;
        }));

    test('Request reset of field', () => user
        .post('/data/clinicalEvent')
        .send({ clinicalEventId: 5, update: { 17: '' } })
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