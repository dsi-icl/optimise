/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const VisitController = require('../src/controllers/visitController');
const tokens = require('./token');
const token = tokens.token;
const standardToken = tokens.standardToken;

describe('Visit controller tests', () => {
    test('getting visits of a patient', () => request
        .get('/api/visits?patientId=hey')
        .set('token', token)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('getting visits of a patient that does not have visit', () => request
        .get('/api/visits?patientId=chon')
        .set('token', token)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
        }));

    test('creating visit for a patient', () => request
        .post('/api/visits')
        .set('token', token)
        .send({
            'patientId': 'chon',
            'visitDate': { 'day': 29, 'month': 2, 'year': 2000 }
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
        }));

    test('creating visit for a patient with malformed date', () => request
        .post('/api/visits')
        .set('token', token)
        .send({
            'patientId': 'chon',
            'visitDate': { 'day': 29, 'month': 2, 'year': 2001 }
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('getting visits of this patient', () => request
        .get('/api/visits?patientId=chon')
        .set('token', token)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(1);
        }));

    test('deleting visit from visitId', () => request
        .delete('/api/visits')
        .set('token', token)
        .send({ 'visitId':2 })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));
});