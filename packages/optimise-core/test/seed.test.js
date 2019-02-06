/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const { connectAdmin, connectUser, disconnectAgent } = require('./connection');

const visitField = require('/../db/availableFields/jsonFiles/visitFields.json');

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Getting seeds', () => {
    test('Getting not existing fields', () => admin
        .get('/seeds/availableNotValid')
        .then(res => {
            expect(res.status).toBe(404);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGPATH);
            return true;
        }));

    test('Getting a field with invalid query', () => admin
        .get('/seeds/fieldVisit?test=WRONG')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.GETFAIL);
            return true;
        }));

    test('Getting a type with valid query', () => admin
        .get('/seeds/typeVisit?name=Remote')
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body).toBeDefined();
            expect(res.body.length).toBe(1);
            expect(res.body[0].id).toBeDefined();
            expect(res.body[0].id).toBe(2);
            return true;
        }));
});

describe('Creating field', () => {
    test('Creating to wrong url', () => admin
        .post('/seeds/fakePath')
        .then(res => {
            expect(res.status).toBe(404);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGPATH);
            return true;
        }));

    test('Creating with missing arguments', () => admin
        .post('/seeds/fieldVisit')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating with wrong values', () => admin
        .post('/seeds/fieldVisit')
        .send({
            definition: 1, //Should be a string
            idname: 'visit_systolic_blood_pressure',
            type: 2,
            unit: 'mmHg',
            module: 'Ms',
            permittedValues: null,
            referenceType: 1
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(`${message.userError.WRONGARGUMENTS} : definition`);
            return true;
        }));

    test('Creating with good values', () => admin
        .post('/seeds/fieldVisit')
        .send({
            definition: `DEFINITION: rand value for unique ${Math.random().toString(36).substr(2, 5)}`,
            idname: `IDNAME: rand value for unique ${Math.random().toString(36).substr(2, 5)}`,
            section: 1,
            subsection: null,
            type: 2,
            unit: 'mmHg',
            module: 'MS',
            permittedValues: null,
            labels: null,
            referenceType: 1,
            laterality: null,
            cdiscName: null
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(visitField.length);
            return true;
        }));
});

describe('Updating field', () => {
    test('Updating to wrong url', () => admin
        .put('/seeds/fakePath')
        .then(res => {
            expect(res.status).toBe(404);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGPATH);
            return true;
        }));

    test('Updating with missing arguments', () => admin
        .put('/seeds/fieldVisit')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Updating with wrong values', () => admin
        .put('/seeds/fieldVisit')
        .send({
            id: visitField.length + 1,
            definition: 1, // should be a string
            idname: 'testing_test',
            section: 1,
            subsection: null,
            type: 2,
            unit: 'mmHg',
            module: 'MS',
            permittedValues: null,
            labels: null,
            referenceType: 1,
            laterality: null,
            cdiscName: null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Updating with good values', () => admin
        .put('/seeds/fieldVisit')
        .send({
            id: visitField.length,
            definition: `DEFINITION: rand value for unique ${Math.random().toString(36).substr(2, 5)}`,
            idname: `IDNAME: rand value for unique ${Math.random().toString(36).substr(2, 5)}`,
            section: 1,
            subsection: null,
            type: 2,
            unit: 'mmHg',
            module: 'MS',
            permittedValues: null,
            labels: null,
            referenceType: 1,
            laterality: null,
            cdiscName: null
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));
});

describe('Deleting field', () => {
    test('Deleting to wrong url', () => admin
        .delete('/seeds/fakePath')
        .then(res => {
            expect(res.status).toBe(404);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGPATH);
            return true;
        }));

    test('Deleting with missing arguments', () => admin
        .delete('/seeds/fieldVisit')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Deleting with wrong values', () => admin
        .delete('/seeds/fieldVisit')
        .send({
            id: 'WRONG'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Deleting with good values', () => admin
        .delete('/seeds/fieldVisit')
        .send({
            id: visitField.length
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
        }));

    test('Deleting with good values a second time', () => admin
        .delete('/seeds/fieldVisit')
        .send({
            id: visitField.length + 2
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
            return true;
        }));
});
