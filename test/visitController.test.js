/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const { connectAdmin, connectUser } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user).then();
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
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('Getting visits of a patient that does not have visit', () => admin
        .get('/visits?patientId=florian')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
        }));

    test('Getting visits of a patient that does not have visit (standard user)', () => user
        .get('/visits?patientId=florian')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
        }));

    test('Creating visit for a patient', () => admin
        .post('/visits')
        .send({
            'patientId': 6,
            'visitDate': '29 Jan 2000'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
        }));

    test('Creating the same visit for a patient (should fail; for duplication)', () => admin
        .post('/visits')
        .send({
            'patientId': 6,
            'visitDate': '29 Jan 2000'
        })
        .then(res => {
            expect(res.statusCode).not.toBe(200);
        }));

    test('Creating visit for a patient with malformed date', () => admin
        .post('/visits')
        .send({
            'patientId': 6,
            'visitDate': '32 Mar 2000'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Getting visits of this patient', () => admin
        .get('/visits?patientId=eleno')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(1);
        }));

    test('Deleting visit from visitId', () => admin
        .delete('/visits')
        .send({ 'visitId': 4 })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));
});