/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const { connectAdmin, disconnectAgent } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
});

afterAll(async () => {
    await disconnectAgent(admin);
});

describe('Visit controller tests', () => {
    test('Getting report of a visit', () => admin
        .get('/visits/report?id=1')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            return true;
        }));

    test('Getting report of a visit that does not have visit', () => admin
        .get('/visits/report?id=2')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
            expect(typeof res.body).toBe('object');
            return true;
        }));

    test('Creating report for a visit', () => admin
        .post('/visits/report')
        .send({
            'visit': 2,
            'report': 'Report test 2'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(2);
            return true;
        }));

    test('Creating the same report for a visit (should fail)', () => admin
        .post('/visits/report')
        .send({
            'visit': 2,
            'report': 'Report test 2'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Getting report of this visit', () => admin
        .get('/visits/report?id=2')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(1);
            return true;
        }));

    test('Updating report from id', () => admin
        .put('/visits/report')
        .send({
            'id': 2,
            'report': 'MODIFICATION'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));

    test('Updating report from id second pass', () => admin
        .put('/visits/report')
        .send({
            'id': 2,
            'report': 'Report test 2'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));

    test('Updating report which does not exist', () => admin
        .put('/visits/report')
        .send({
            'id': 1000,
            'report': '15 Feb 1962'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            return true;
        }));

    test('Deleting report from visitId', () => admin
        .delete('/visits/report')
        .send({ 'id': 2 })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));

    test('Deleting report which does not exist', () => admin
        .delete('/visits/report')
        .send({ 'id': 1000 })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
            return true;
        }));
});