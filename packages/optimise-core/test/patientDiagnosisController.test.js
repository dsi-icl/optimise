import request from 'supertest';
import message from '../src/utils/message-utils';
import { connectAdmin, connectUser, disconnectAgent } from './connection';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);

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
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Creating diagnosis with missing diagnosis parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: 1,
                diagnosisDate: '2000-01-01'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Creating diagnosis with missing patient parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                diagnosis: 3,
                diagnosisDate: '2000-01-01'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Creating diagnosis with missing date parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: 1,
                diagnosis: 3
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Creating diagnosis with wrong patient parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: {},
                diagnosis: 3,
                diagnosisDate: '2000-01-01'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            }));

    test('Creating diagnosis with bad patient parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: 90,
                diagnosis: 3,
                diagnosisDate: '2000-01-01'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
                return true;
            }));

    test('Creating diagnosis with wrong diagnosis parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: 1,
                diagnosis: {},
                diagnosisDate: '2000-01-01'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            }));

    test('Creating diagnosis with bad diagnosis parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: 90,
                diagnosis: 6000,
                diagnosisDate: '2000-01-01'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
                return true;
            }));

    test('Creating diagnosis with wrong date parameter', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: 1,
                diagnosis: 3,
                diagnosisDate: {}
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            }));

    test('Creating diagnosis with good parameters', () =>
        admin.post('/patientDiagnosis/')
            .send({
                patient: 1,
                diagnosis: 3,
                diagnosisDate: '2000-01-01'
            })
            .then(({ status, body }) => {
                expect(status).toBe(200);
                expect(typeof body).toBe('object');
                expect(body.state).toBeDefined();
                expect(body.state).toBe(7);
                return true;
            }));
});

describe('Editing Diagnosis test suite', () => {
    test('Editing with empty body', () =>
        admin.put('/patientDiagnosis')
            .send({})
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Editing without id parameter', () =>
        admin.put('/patientDiagnosis')
            .send({
                diagnosis: 3
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Editing with wrong id', () =>
        admin.put('/patientDiagnosis')
            .send({
                id: {},
                diagnosis: 3
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            }));

    test('Editing with bad id', () =>
        admin.put('/patientDiagnosis')
            .send({
                id: 90,
                diagnosis: 3
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
                return true;
            }));

    test('Editing with bad diagnosis', () =>
        admin.put('/patientDiagnosis')
            .send({
                id: 4,
                diagnosis: 300
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
                return true;
            }));

    test('Editing with good parameters', () =>
        admin.put('/patientDiagnosis')
            .send({
                id: 2,
                diagnosis: 7
            })
            .then(({ status, body }) => {
                expect(status).toBe(200);
                expect(typeof body).toBe('object');
                expect(body.state).toBeDefined();
                expect(body.state).toBe(1);
                return true;
            }));
});

describe('Delete diagnosis test suite', () => {
    test('Deleting with empty body', () =>
        admin.delete('/patientDiagnosis')
            .send({
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Deleting with wrong id', () =>
        admin.delete('/patientDiagnosis')
            .send({
                id: {}
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            }));

    test('Deleting with bad id', () =>
        admin.delete('/patientDiagnosis')
            .send({
                id: 90
            })
            .then(({ status, body }) => {
                expect(status).toBe(200);
                expect(typeof body).toBe('object');
                expect(body.state).toBeDefined();
                expect(body.state).toBe(0);
                return true;
            }));

    test('Deleting with good parameters', () =>
        admin.delete('/patientDiagnosis')
            .send({
                id: 4
            })
            .then(({ status, body }) => {
                expect(status).toBe(200);
                expect(typeof body).toBe('object');
                expect(body.state).toBeDefined();
                expect(body.state).toBe(1);
                return true;
            }));

});