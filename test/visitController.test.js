/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const adminToken = require('./token').adminToken;
const standardToken = require('./token').standardToken;

describe('Visit controller tests', () => {
    test('getting visits of a patient', () => request
        .get('/api/visits?patientId=florian')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('getting visits of a patient (standard user)', () => request
        .get('/api/visits?patientId=florian')
        .set('token', standardToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('getting visits of a patient that does not have visit', () => request
        .get('/api/visits?patientId=chon')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
        }));

    test('getting visits of a patient that does not have visit (standard user)', () => request
        .get('/api/visits?patientId=chon')
        .set('token', standardToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(0);
        }));

    test('creating visit for a patient', () => request
        .post('/api/visits')
        .set('token', adminToken)
        .send({
            'patientId': 'chon',
            'visitDate': { 'day': 29, 'month': 2, 'year': 2000 }
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
        }));

    test('creating the same visit for a patient (should fail; for duplication)', () => request
        .post('/api/visits')
        .set('token', adminToken)
        .send({
            'patientId': 'chon',
            'visitDate': { 'day': 29, 'month': 2, 'year': 2000 }
        })
        .then(res => {
            expect(res.statusCode).not.toBe(200);
        }));

    test('creating visit for a patient with malformed date', () => request
        .post('/api/visits')
        .set('token', adminToken)
        .send({
            'patientId': 'chon',
            'visitDate': { 'day': 29, 'month': 2, 'year': 2001 }
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('getting visits of this patient', () => request
        .get('/api/visits?patientId=chon')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(1);
        }));

    test('deleting visit from visitId', () => request
        .delete('/api/visits')
        .set('token', adminToken)
        .send({ 'visitId': 2 })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));
});