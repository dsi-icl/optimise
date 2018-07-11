/* global describe test expect */

const request = require('supertest')(global.optimiseRouter);
const adminToken = require('./token').adminToken;
const standardToken = require('./token').standardToken;

describe('Visit controller tests', () => {
    test('Getting visits of a patient', () => request
        .get('/visits?patientId=chon')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('Getting visits of a patient (standard user)', () => request
        .get('/visits?patientId=chon')
        .set('token', standardToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('Getting visits of a patient that does not have visit', () => request
        .get('/visits?patientId=florian')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
        }));

    test('Getting visits of a patient that does not have visit (standard user)', () => request
        .get('/visits?patientId=florian')
        .set('token', standardToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
        }));

    test('Creating visit for a patient', () => request
        .post('/visits')
        .set('token', adminToken)
        .send({
            'patientId': 6,
            'visitDate': '29 Jan 2000'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
        }));

    test('Creating the same visit for a patient (should fail; for duplication)', () => request
        .post('/visits')
        .set('token', adminToken)
        .send({
            'patientId': 6,
            'visitDate': '29 Jan 2000'
        })
        .then(res => {
            expect(res.statusCode).not.toBe(200);
        }));

    test('Creating visit for a patient with malformed date', () => request
        .post('/visits')
        .set('token', adminToken)
        .send({
            'patientId': 6,
            'visitDate': '32 Mar 2000'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Getting visits of this patient', () => request
        .get('/visits?patientId=eleno')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(1);
        }));

    test('Deleting visit from visitId', () => request
        .delete('/visits')
        .set('token', adminToken)
        .send({ 'visitId': 4 })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));
});