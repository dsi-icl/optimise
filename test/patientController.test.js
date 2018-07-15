/* global describe test expect */

//UNFINISHED: test erase patients
const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const userSeeded = require('../db/exampleDataForTesting/exampleData')['PATIENTS'];
const message = require('../src/utils/message-utils');
const { connectAdmin, connectUser, deconnectAgent } = require('./connection');

beforeAll(async() => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user).then();
});

afterAll(async() => { //eslint-disable-line no-undef
    await deconnectAgent(admin);
    await deconnectAgent(user);
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
                delete userSeeded[i].id;
                delete userSeeded[i].createdByUser;
                delete userSeeded[i].deleted;
                expect(res.body[i]).toMatchObject(userSeeded[i]);
            }
        }));

    test('Searching patients with similar alias_id\'s', () => admin
        .get('/patients?id=o')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(2);
        }));

    test('Searching patients with similar alias_id\'s but with double "id" query', () => admin
        .get('/patients?id=ch&id=css')
        .then(res => {
            expect(res.statusCode).not.toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.INVALIDQUERY);
        }));

    test('Searching patients with similar alias_id\'s but with two queries', () => admin
        .get('/patients?id=ch&iddd=css')
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.INVALIDQUERY);
        }));

    test('Creating a new patient', () => admin
        .post('/patients')
        .send({
            'aliasId': 'littlePatient',
            'study': 'optimise'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(8);
        }));

    test('Creating the same patient again (should fail)', () => admin
        .post('/patients')
        .send({
            'aliasId': 'littlePatient',
            'study': 'optimise'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('getting this patient', () => admin
        .get('/patients/littlePatient')
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('Deleting a patient by standard User (should fail)', () => user
        .patch('/patients')
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('Deleting a patient', () => admin
        .patch('/patients')
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Deleting this patient again (should return 200 amd state:0)', () => admin
        .patch('/patients')
        .send({ 'aliasId': 'littlePatient' })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));
});