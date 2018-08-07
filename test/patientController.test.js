/* global beforeAll afterAll describe test expect */

//UNFINISHED: test erase patients
const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const userSeeded = require('../db/exampleDataForTesting/exampleData')['PATIENTS'];
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

describe('Patient controller tests', () => {
    test('Getting all patients', () => admin
        .get('/patients')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(userSeeded.length);
            for (let i = 0; i, i < res.body.length; i++) {
                userSeeded[i].patientId = userSeeded[i].id;
                delete userSeeded[i].uuid;
                delete userSeeded[i].id;
                delete userSeeded[i].createdByUser;
                delete userSeeded[i].deleted;
                expect(res.body[i]).toMatchObject(userSeeded[i]);
            }
            return true;
        }));

    test('Searching patients with similar alias_id\'s', () => admin
        .get('/patients?value=o')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            return true;
        }));

    test('Searching patients with similar alias_id\'s but with double "id" query', () => admin
        .get('/patients?value=ch&value=css')
        .then(res => {
            expect(res.statusCode).not.toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.INVALIDQUERY);
            return true;
        }));

    test('Searching patients with similar alias_id\'s but with two queries', () => admin
        .get('/patients?value=ch&iddd=css&ed=42')
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.INVALIDQUERY);
            return true;
        }));

    test('Searching patients with diagnosis PPMS', () => admin
        .get('/patients?field=MHTERM&value=PPMS')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBe(2);
            return true;
        }));

    test('Creating a new patient with no consent (should fail)', () => admin
        .post('/patients')
        .send({
            'aliasId': 'littlePatient',
            'study': 'optimise'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating a new patient', () => admin
        .post('/patients')
        .send({
            'aliasId': 'littlePatient',
            'study': 'optimise',
            'consent': false
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(8);
            return true;
        }));

    test('Creating the same patient again (should fail)', () => admin
        .post('/patients')
        .send({
            'aliasId': 'littlePatient',
            'study': 'optimise',
            'consent': true
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Getting this patient', () => admin
        .get('/patients/littlePatient')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.patientId).toBe('littlePatient');
            expect(res.body.id).toBe(8);
            expect(res.body.consent).toBe(false);
            expect(res.body.immunisations).toBeDefined();
            expect(res.body.medicalHistory).toBeDefined();
            expect(res.body.visits).toBeDefined();
            expect(res.body.tests).toBeDefined();
            expect(res.body.treatments).toBeDefined();
            expect(res.body.clinicalEvents).toBeDefined();
            expect(res.body.pregnancy).toBeDefined();
            expect(res.body.diagnosis).toBeDefined();
            expect(res.body.demographicData).toBeUndefined();
            return true;
        }));

    test('Getting this patient but only visits', () => admin
        .get('/patients/chon')
        .send({ 'getOnly': 'getVisits' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.patientId).toBe('chon');
            expect(res.body.id).toBe(1);
            expect(res.body.consent).toBe(true);
            expect(res.body.visits).toBeDefined();
            expect(res.body.tests).toBeUndefined();
            return true;
        }));

    test('Getting this patient but only invalid properties', () => admin
        .get('/patients/littlePatient')
        .send({ 'getOnly': 'must,not,work' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            return true;
        }));

    test('Updating this patient', () => admin
        .put('/patients/')
        .send({
            'id': 8,
            'study': 'unknown',
            'consent': true
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            return true;
        }));

    test('Verifying patient consent update', () => admin
        .get('/patients/littlePatient')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.patientId).toBe('littlePatient');
            expect(res.body.id).toBe(8);
            expect(res.body.consent).toBe(true);
            return true;
        }));

    test('Deleting a patient by standard User (should fail)', () => user
        .patch('/patients')
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('Deleting a patient', () => admin
        .patch('/patients')
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));

    test('Deleting this patient again (should return 200 amd state:0)', () => admin
        .patch('/patients')
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
            return true;
        }));
});