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

let createdPregnancyEntryId;
describe('Create pregnancy controller tests', () => {
    test('Request creation without body (should fail)', () => admin
        .post('/demographics/PregnancyEntry')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with bad body (should fail)', () => admin
        .post('/demographics/PregnancyEntry')
        .send({ vis: 1, teep: 1, Date: '2020-01-01' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with wrong type visit (should fail)', () => admin
        .post('/demographics/PregnancyEntry')
        .send({ visitId: 'WRONG', type: 1, pregnancyId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with wrong type type (should fail)', () => admin
        .post('/demographics/PregnancyEntry')
        .send({ visitId: 1, type: 'WRONG', pregnancyId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with wrong pregnancy (should fail)', () => admin
        .post('/demographics/PregnancyEntry')
        .send({ visitId: 1, type: 1, pregnancyId: 'WRONG' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with good body (should succeed)', () => admin
        .post('/demographics/PregnancyEntry')
        .send({ visitId: 1, type: 1, pregnancyId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.length).toBeDefined();
            expect(body[0].id).toBeGreaterThan(1);
            return true;
        }));
    test('Request creation with good body (should succeed)', () => admin
        .post('/demographics/PregnancyEntry')
        .send({ visitId: 2, type: 1, pregnancyId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.length).toBeDefined();
            expect(body[0].id).toBeGreaterThan(1);
            return true;
        }));
});

describe('Update pregnancy entry controller tests', () => {
    test('Update a pregnancy entry', () => admin
        .put('/demographics/PregnancyEntry')
        .send({ id: 1, type: 2, pregnancyId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.length).toBeDefined();
            expect(body[0].id).toBe(1);
            return true;
        }));

    test('Update a pregnancy entry', () => admin
        .put('/demographics/PregnancyEntry')
        .send({ id: 2, type: 2, pregnancyId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.length).toBeDefined();
            expect(body[0].id).toBe(2);
            return true;
        }));
});

describe('Delete pregnancy entry controller tests', () => {
    test('Request deletion without body (should fail)', () => admin
        .delete('/demographics/PregnancyEntry')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion with bad body (should fail)', () => admin
        .delete('/demographics/PregnancyEntry')
        .send({ 'visit_-Id': createdPregnancyEntryId })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion with good body by standard user (should succeed)', () => user
        .delete('/demographics/PregnancyEntry')
        .send({ pregnancyEntryId: 2 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Request deletion with bad ID type (should fail)', () => admin
        .delete('/demographics/PregnancyEntry')
        .send({ pregnancyEntryId: 'WRONG' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request deletion with bad ID reference (should fail)', () => admin
        .delete('/demographics/PregnancyEntry')
        .send({ pregnancyEntryId: 99999999 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));
});
