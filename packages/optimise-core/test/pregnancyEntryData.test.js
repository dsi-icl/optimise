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

describe('Creating PREGNANCY ENTRY data', () => {
    test('Request creation without body', () => admin
        .post('/data/pregnancyEntry').then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}pregnancyEntryId`);
            return true;
        }));

    test('Request creation without add or update', () => admin
        .post('/data/pregnancyEntry')
        .send({ pregnancyEntryId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}pregnancyEntryId`);
            return true;
        }));

    test('Request creation without pregnancy entry id', () => admin
        .post('/data/pregnancyEntry')
        .send({ add: { 5: 100 } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(`${message.dataMessage.MISSINGVALUE}pregnancyEntryId`);
            return true;
        }));

    test('Request creation with invalid value for id', () => admin
        .post('/data/pregnancyEntry')
        .send({ pregnancyEntryId: 99, add: { 1: 100 } })
        .then(({ status, body }) => {
            expect(status).toBe(404);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.PREGNANCYENTRY);
            return true;
        }));

    test('Request creation with invalid field', () => admin
        .post('/data/pregnancyEntry')
        .send({ pregnancyEntryId: 1, add: { 534567: 10 } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.FIELDNOTFOUND);
            return true;
        }));

    test('Request creation with invalid value for requested field', () => admin
        .post('/data/pregnancyEntry')
        .send({ pregnancyEntryId: 1, add: {} })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.FIELDNOTFOUND);
            return true;
        }));

    test('Request creation with unmatching test and field', () => admin
        .post('/data/pregnancyEntry')
        .send({ pregnancyEntryId: 1, add: { 50: 120 } })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dataMessage.INVALIDFIELD);
            return true;
        }));

    test('Request creation succesfull', () => user
        .post('/data/pregnancyEntry')
        .send({ pregnancyEntryId: 1, add: { 50: 10 } })
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
        .post('/data/pregnancyEntry')
        .send({ pregnancyEntryId: 1, update: { 50: 65 } })
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