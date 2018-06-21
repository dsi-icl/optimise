/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const tokens = require('./token');
const token = tokens.token;
const standardToken = tokens.standardToken;


const PatientController = require('../src/controllers/patientController');

describe('Patient controller tests', () => {
    test('Getting all patients', () => {
        return request
            .get('/api/patients')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body.length).toBeGreaterThanOrEqual(1);
            });
    });

    test('Searching patients with similar alias_id\'s', () => {
        return request
            .get('/api/patients?id=hey')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body.length).toBeGreaterThanOrEqual(2);
            });
    });

    test('Searching patients with similar alias_id\'s but with double "id" query', () => {
        return request
            .get('/api/patients?id=ch&id=css')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).not.toBe(200);
                expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
            });
    });

    test('Searching patients with similar alias_id\'s but with two queries', () => {
        return request
            .get('/api/patients?id=ch&iddd=css')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(400);
                expect(res.headers['content-type']).toBe('text/html; charset=utf-8');
            });
    });

    test('Creating a new patient', () => {
        return request
            .post('/api/patients')
            .set('token', token)
            .send({
                'aliasId': 'littlePatient',
                'study': 'optimise'})
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    test('Creating the same patient again', () => {
        return request
            .post('/api/patients')
            .set('token', token)
            .send({
                'aliasId': 'littlePatient',
                'study': 'optimise'})
            .then(res => {
                expect(res.statusCode).toBe(400);
            });
    });

    test('getting this patient', () => {
        return request
            .get('/api/patientProfile/littlePatient')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    test('Deleting a patient', () => {
        return request
            .delete('/api/patients')
            .set('token', token)
            .send({'aliasId': 'littlePatient'})
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    test('Deleting this patient again', () => {
        return request
            .delete('/api/patients')
            .set('token', token)
            .send({'aliasId': 'littlePatient'})
            .then(res => {
                expect(res.statusCode).toBe(404);
            });
    });
});