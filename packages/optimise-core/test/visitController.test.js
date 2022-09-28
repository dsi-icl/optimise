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

describe('Visit controller tests', () => {
    test('Getting visits of a patient', () => admin
        .get('/visits?patientId=chon')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBeGreaterThanOrEqual(1);
            return true;
        }));

    test('Getting visits of a patient (standard user)', () => user
        .get('/visits?patientId=chon')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBe(2);
            expect(typeof body).toBe('object');
            return true;
        }));

    test('Getting visits of a patient that does not have visit', () => admin
        .get('/visits?patientId=florian')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBe(0);
            expect(typeof body).toBe('object');
            return true;
        }));

    test('Creating visit for a patient', () => admin
        .post('/visits')
        .send({
            patientId: 6,
            visitDate: '2000-01-29'
        })
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(5);
            return true;
        }));

    test('Creating the same visit for a patient (Should Succeed; even for duplication)', () => admin
        .post('/visits')
        .send({
            patientId: 6,
            visitDate: '2000-01-29'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(6);
            return true;
        }));

    test('Creating visit for a patient with malformed date', () => admin
        .post('/visits')
        .send({
            patientId: 6,
            visitDate: '32 Mar 2000'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.INVALIDDATE);
            return true;
        }));

    test('Getting visits of this patient', () => admin
        .get('/visits?patientId=eleno')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBe(2);
            return true;
        }));

    test('Updating visit from id', () => admin
        .put('/visits')
        .send({
            id: 1,
            visitDate: '1990-03-05'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Updating visit\'s communication', () => admin
        .put('/visits')
        .send({
            id: 1,
            communication: JSON.stringify({ blockObject: { a: 'b' } })
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Updating visit from id second pass', () => admin
        .put('/visits')
        .send({
            id: 1,
            visitDate: '1962-02-15'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Updating visit which does not exist', () => admin
        .put('/visits')
        .send({
            id: 1000,
            visitDate: '1962-02-15'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            return true;
        }));

    test('Deleting visit from visitId', () => admin
        .delete('/visits')
        .send({ visitId: 4 })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Deleting visit which does not exist', () => admin
        .delete('/visits')
        .send({ visitId: 1000 })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));
});