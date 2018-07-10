/* global describe test expect */

//UNFINISHED: test erase patients
const app = require('../src/app');
const request = require('supertest')(app);
const adminToken = require('./token').adminToken;
const standardToken = require('./token').standardToken;

describe('Patient controller tests', () => {
    test('Getting all patients', () => request
        .get('/api/patients')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));

    test('Searching patients with similar alias_id\'s', () => request
        .get('/api/patients?id=o')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        }));

    test('Searching patients with similar alias_id\'s but with double "id" query', () => request
        .get('/api/patients?id=ch&id=css')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).not.toBe(200);
            expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
        }));

    test('Searching patients with similar alias_id\'s but with two queries', () => request
        .get('/api/patients?id=ch&iddd=css')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
        }));

    test('Creating a new patient', () => request
        .post('/api/patients')
        .set('token', adminToken)
        .send({
            'aliasId': 'littlePatient',
            'study': 'optimise'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('Creating the same patient again (should fail)', () => request
        .post('/api/patients')
        .set('token', adminToken)
        .send({
            'aliasId': 'littlePatient',
            'study': 'optimise'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('getting this patient', () => request
        .get('/api/patientProfile/littlePatient')
        .set('token', adminToken)
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('Deleting a patient by standard User (should fail)', () => request
        .patch('/api/patients')
        .set('token', standardToken)
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.statusCode).toBe(401);
        }));

    test('Deleting a patient', () => request
        .patch('/api/patients')
        .set('token', adminToken)
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('Deleting this patient again (should return 200)', () => request
        .patch('/api/patients')
        .set('token', adminToken)
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));
});