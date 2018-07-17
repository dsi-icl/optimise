/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const user = request.agent(global.optimiseRouter);
const { connectAdmin, connectUser, deconnectAgent } = require('./connection');

beforeAll(async () => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user).then();
});

afterAll(async () => { //eslint-disable-line no-undef
    await deconnectAgent(admin);
    await deconnectAgent(user);
});

describe('Create PII controller test', () => {
    test('Create PII without body', () =>
        admin.post('/patientPii/')
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            })
    );

    test('Create PII without patient', () =>
        admin.post('/patientPii/')
            .send({
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            })
    );

    test('Create PII with wrong patient', () =>
        admin.post('/patientPii/')
            .send({
                'patient': {},
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            })
    );

    test('Create PII with bad patient', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 90,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            })
    );

    test('Create PII without firstname', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 2,
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            })
    );

    test('Create PII with wrong firstname', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 2,
                'firstName': {},
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            })
    );

    test('Create PII without surname', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 2,
                'firstName': 'Chon',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            })
    );

    test('Create PII with wrong surname', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 2,
                'firstName': 'Chon',
                'surname': {},
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            })
    );

    test('Create PII without address', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 2,
                'firstName': 'Chon',
                'surname': 'Sou',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            })
    );

    test('Create PII with wrong fullAddress', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 2,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': {},
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            })
    );

    test('Create PII with good parameters', () =>
        admin.post('/patientPii/')
            .send({
                'patient': 2,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(3);
            })
    );

});

describe('Editing PII test suite', () => {
    test('Editing with empty body', () =>
        admin.put('/patientPii/')
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Editing without id parameter', () =>
        admin.put('/patientPii/')
            .send({
                'patient': 1,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Editing with wrong id', () =>
        admin.put('/patientPii/')
            .send({
                'id': {},
                'patient': 1,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            }));

    test('Editing with bad id', () =>
        admin.put('/patientPii/')
            .send({
                'id': 90,
                'patient': 1,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
            }));

    test('Editing with bad patient', () =>
        admin.put('/patientPii/')
            .send({
                'id': 3,
                'patient': 90,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
            }));

    test('Editing with good parameters', () =>
        admin.put('/patientPii/')
            .send({
                'id': 1,
                'patient': 1,
                'firstName': 'Chon',
                'surname': 'Sou',
                'fullAddress': 'ICL, South Kensington, London',
                'postcode': 'W6 ICL'
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(1);
            }));
});

describe('Delete PII test suite', () => {
    test('Deleting with empty body', () =>
        admin.delete('/patientPii/')
            .send({
            })
            .then(res => {
                expect(res.status).toBe(400);
                expect(typeof res.body).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            }));

    test('Deleting with wrong id', () =>
        admin.delete('/patientPii/')
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
        admin.delete('/patientPii/')
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
        admin.delete('/patientPii/')
            .send({
                'id': 3
            })
            .then(res => {
                expect(res.status).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(1);
            }));

});