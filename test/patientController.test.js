/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);

const PatientController = require('../src/controllers/patientController');


const token = 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb';     //place holder for test that generates token



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
            .get('/api/patients?id=ch')
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
                'alias_id': 'littlePatient',
                'study': 'optimise'
            })
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    test('Creating the same patient again', () => {
        return request
            .post('/api/patients')
            .set('token', token)
            .send({
                'alias_id': 'littlePatient',
                'study': 'optimise'
            })
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
            .send({ 'alias_id': 'littlePatient' })
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    test('Deleting this patient again', () => {
        return request
            .delete('/api/patients')
            .set('token', token)
            .send({ 'alias_id': 'littlePatient' })
            .then(res => {
                expect(res.statusCode).toBe(404);
            });
    });


});