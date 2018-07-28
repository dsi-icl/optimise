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

describe('Create diagnosis test suite', () => {
    test('Creating diagnosis with empty body', () =>
        admin.post('/patientDiagnosis')
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Creating diagnosis with missing diagnosis parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': 1,
                'diagnosisDate': '1 Jan 2000'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Creating diagnosis with missing patient parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'diagnosis': 3,
                'diagnosisDate': '1 Jan 2000'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Creating diagnosis with missing date parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': 1,
                'diagnosis': 3
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Creating diagnosis with wrong patient parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': {},
                'diagnosis': 3,
                'diagnosisDate': '1 Jan 2000'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            }));

    test('Creating diagnosis with bad patient parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': 90,
                'diagnosis': 3,
                'diagnosisDate': '1 Jan 2000'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            }));

    test('Creating diagnosis with wrong diagnosis parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': 1,
                'diagnosis': {},
                'diagnosisDate': '1 Jan 2000'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            }));

    test('Creating diagnosis with bad diagnosis parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': 90,
                'diagnosis': 6000,
                'diagnosisDate': '1 Jan 2000'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            }));

    test('Creating diagnosis with wrong date parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': 1,
                'diagnosis': 3,
                'diagnosisDate': {}
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            }));

    test('Creating diagnosis with good parameters', () =>
        admin.post('/patientDiagnosis/')
            .send({
                'patient': 1,
                'diagnosis': 4,
                'diagnosisDate': '1 Jan 2000'
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(7);
            }));
});

describe('Editing Diagnosis test suite', () => {
    test('Editing with empty body', () =>
        admin.put('/patientDiagnosis')
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Editing without id parameter', () =>
        admin.put('/patientDiagnosis')
            .send({
                'diagnosis': 3
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Editing with wrong id', () =>
        admin.put('/patientDiagnosis')
            .send({
                'id': {},
                'diagnosis': 3
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            }));

    test('Editing with bad id', () =>
        admin.put('/patientDiagnosis')
            .send({
                'id': 90,
                'diagnosis': 3
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
            }));

    test('Editing with bad diagnosis', () =>
        admin.put('/patientDiagnosis')
            .send({
                'id': 4,
                'diagnosis': 300
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
            }));

    test('Editing with good parameters', () =>
        admin.put('/patientDiagnosis')
            .send({
                'id': 2,
                'diagnosis': 7
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(1);
            }));
});

describe('Delete diagnosis test suite', () => {
    test('Deleting with empty body', () =>
        admin.delete('/patientDiagnosis')
            .send({
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Deleting with wrong id', () =>
        admin.delete('/patientDiagnosis')
            .send({
                'id': {}
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            }));

    test('Deleting with bad id', () =>
        admin.delete('/patientDiagnosis')
            .send({
                'id': 90
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(0);
            }));

    test('Deleting with good parameters', () =>
        admin.delete('/patientDiagnosis')
            .send({
                'id': 4
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(1);
            }));

});