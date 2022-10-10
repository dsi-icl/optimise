import request from 'supertest';
import message from '../src/utils/message-utils';
import { connectAdmin, disconnectAgent } from './connection';

const admin = request.agent(global.optimiseRouter);

beforeAll(async () => {
    await connectAdmin(admin);
});

afterAll(async () => {
    await disconnectAgent(admin);
});

describe('Visit controller tests', () => {
    test('Getting report of a visit', () => admin
        .get('/visits/report?id=1')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBeGreaterThanOrEqual(1);
            return true;
        }));

    test('Getting report of a visit that does not have visit', () => admin
        .get('/visits/report?id=2')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBe(0);
            expect(typeof body).toBe('object');
            return true;
        }));

    test('Creating report for a visit', () => admin
        .post('/visits/report')
        .send({
            visit: 2,
            report: 'Report test 2'
        })
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(2);
            return true;
        }));

    test('Creating the same report for a visit (should fail)', () => admin
        .post('/visits/report')
        .send({
            visit: 2,
            report: 'Report test 2'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Getting report of this visit', () => admin
        .get('/visits/report?id=2')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBe(1);
            return true;
        }));

    test('Updating report from id', () => admin
        .put('/visits/report')
        .send({
            id: 2,
            report: 'MODIFICATION'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Updating report from id second pass', () => admin
        .put('/visits/report')
        .send({
            id: 2,
            report: 'Report test 2'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Updating report which does not exist', () => admin
        .put('/visits/report')
        .send({
            id: 1000,
            report: '15 Feb 1962'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            return true;
        }));

    test('Deleting report from visitId', () => admin
        .delete('/visits/report')
        .send({ id: 2 })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Deleting report which does not exist', () => admin
        .delete('/visits/report')
        .send({ id: 1000 })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));
});