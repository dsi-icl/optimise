//UNFINISHED: test erase patients
import request from 'supertest';
import message from '../src/utils/message-utils';
import { connectAdmin, connectUser, disconnectAgent } from './connection';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const userSeeded = require('./seed/data').default[1][1];

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
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBe(userSeeded.length);
            for (let i = 0; i < body.length; i++) {
                userSeeded[i].patientId = userSeeded[i].id;
                delete userSeeded[i].uuid;
                delete userSeeded[i].id;
                delete userSeeded[i].createdByUser;
                delete userSeeded[i].deleted;
                expect(body[i]).toMatchObject(userSeeded[i]);
            }
            return true;
        }));

    test('Searching patients with similar alias_id\'s', () => admin
        .get('/patients?value=o')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBeGreaterThanOrEqual(2);
            return true;
        }));

    test('Searching patients with similar alias_id\'s but with double "id" query', () => admin
        .get('/patients?value=ch&value=css')
        .then(({ statusCode, body }) => {
            expect(statusCode).not.toBe(200);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.INVALIDQUERY);
            return true;
        }));

    test('Searching patients with similar alias_id\'s but with two queries', () => admin
        .get('/patients?value=ch&iddd=css&ed=42')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.INVALIDQUERY);
            return true;
        }));

    test('Searching patients with diagnosis PPMS', () => admin
        .get('/patients?field=MHTERM&value=PPMS')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(body.length).toBe(2);
            return true;
        }));

    test('Creating a new patient with no consent (should fail)', () => admin
        .post('/patients')
        .send({
            aliasId: 'littlePatient',
            study: 'optimise'
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating a new patient', () => admin
        .post('/patients')
        .send({
            aliasId: 'littlePatient',
            study: 'NA',
            consent: false
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(8);
            return true;
        }));

    test('Creating the same patient again (should fail)', () => admin
        .post('/patients')
        .send({
            aliasId: 'littlePatient',
            study: new Date().toISOString(),
            consent: true
        })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Getting this patient', () => admin
        .get('/patients/littlePatient')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.patientId).toBe('littlePatient');
            expect(body.id).toBe(8);
            expect(body.consent).toBe(false);
            expect(body.participation).toBe(true);
            expect(body.immunisations).toBeDefined();
            expect(body.medicalHistory).toBeDefined();
            expect(body.visits).toBeDefined();
            expect(body.tests).toBeDefined();
            expect(body.treatments).toBeDefined();
            expect(body.clinicalEvents).toBeDefined();
            expect(body.pregnancy).toBeDefined();
            expect(body.diagnosis).toBeDefined();
            expect(body.demographicData).toBeUndefined();
            return true;
        }));

    test('Getting this patient but only visits', () => admin
        .get('/patients/chon')
        .send({ getOnly: 'getVisits' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.patientId).toBe('chon');
            expect(body.id).toBe(1);
            expect(body.consent).toBe(true);
            expect(body.participation).toBe(true);
            expect(body.immunisations).toBeUndefined();
            expect(body.medicalHistory).toBeUndefined();
            expect(body.visits).toBeDefined();
            expect(body.tests).toBeUndefined();
            expect(body.treatments).toBeUndefined();
            expect(body.clinicalEvents).toBeUndefined();
            expect(body.pregnancy).toBeUndefined();
            expect(body.diagnosis).toBeUndefined();
            expect(body.demographicData).toBeUndefined();
            return true;
        }));

    test('Getting this patient but only invalid properties', () => admin
        .get('/patients/littlePatient')
        .send({ getOnly: 'must,not,work' })
        .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
            return true;
        }));

    test('Updating this patient consent', () => admin
        .put('/patients/')
        .send({
            id: 8,
            study: 'unknown',
            consent: true
        })
        .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
            return true;
        }));

    test('Verifying patient consent update', () => admin
        .get('/patients/littlePatient')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.patientId).toBe('littlePatient');
            expect(body.id).toBe(8);
            expect(body.consent).toBe(true);
            expect(body.participation).toBe(true);
            return true;
        }));

    test('Updating this patient', () => admin
        .put('/patients/')
        .send({
            id: 8,
            study: 'unknown',
            participation: false
        })
        .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
            return true;
        }));

    test('Verifying patient participation update', () => admin
        .get('/patients/littlePatient')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.patientId).toBe('littlePatient');
            expect(body.id).toBe(8);
            expect(body.consent).toBe(true);
            expect(body.participation).toBe(false);
            return true;
        }));

    test('Deleting a patient by standard User (should fail)', () => user
        .patch('/patients')
        .send({ aliasId: 'littlePatient' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(401);
            expect(body).toHaveProperty('error');
            expect(body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('Deleting a patient', () => admin
        .patch('/patients')
        .send({ aliasId: 'littlePatient' })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Deleting this patient again (should return 200 amd state:0)', () => admin
        .patch('/patients')
        .send({ aliasId: 'littlePatient' })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));
});
