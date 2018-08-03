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

describe('Visit controller tests', () => {
    test('Getting visits of a patient', () => admin
        .get('/visits?patientId=chon')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('Getting visits of a patient (standard user)', () => user
        .get('/visits?patientId=chon')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(2);
            expect(typeof res.body).toBe('object');
        }));

    test('Getting visits of a patient that does not have visit', () => admin
        .get('/visits?patientId=florian')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
            expect(typeof res.body).toBe('object');
        }));

    test('Creating visit for a patient', () => admin
        .post('/visits')
        .send({
            'patientId': 6,
            'visitDate': '2000-01-29'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(5);
        }));

    test('Creating the same visit for a patient (Should Succeed; even for duplication)', () => admin
        .post('/visits')
        .send({
            'patientId': 6,
            'visitDate': '2000-01-29'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(6);
        }));

    test('Creating visit for a patient with malformed date', () => admin
        .post('/visits')
        .send({
            'patientId': 6,
            'visitDate': '32 Mar 2000'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.INVALIDDATE);
        }));

    test('Getting visits of this patient', () => admin
        .get('/visits?patientId=eleno')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(2);
        }));

    test('Updating visit from id', () => admin
        .put('/visits')
        .send({
            'id': 1,
            'visitDate': '1990-03-05'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Updating visit\'s communication', () => admin
        .put('/visits')
        .send({
            'id': 1,
            'communication': JSON.stringify({ blockObject: { a: 'b' } })
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Updating visit from id second pass', () => admin
        .put('/visits')
        .send({
            'id': 1,
            'visitDate': '1962-02-15'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Updating visit which does not exist', () => admin
        .put('/visits')
        .send({
            'id': 1000,
            'visitDate': '1962-02-15'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
        }));

    test('Deleting visit from visitId', () => admin
        .delete('/visits')
        .send({ 'visitId': 4 })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Deleting visit which does not exist', () => admin
        .delete('/visits')
        .send({ 'visitId': 1000 })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));
});