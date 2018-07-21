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


describe('Create treatment controller tests', () => {
    test('Request creation without body (should fail)', () => admin
        .post('/treatments')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request creation with bad body (should fail)', () => admin
        .post('/treatments')

        .send({
            'aaaa': 11,
            'bbbb': 1,
            'cccc': 3,
            'dddd': 'cc',
            'eeee': 'OR',
            'ffff': 3,
            'gggg': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request creation with invalid drug (should fail)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 'WRONG',
            'dose': 3,
            'unit': 'cc',
            'form': 'OR',
            'timesPerDay': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with bad unit (should fail)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 4,
            'dose': 3,
            'unit': 'WRONG',
            'form': 'OR',
            'timesPerDay': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with bad form (should fail)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'WRONG',
            'timesPerDay': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with invalid time zero (should fail)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'OR',
            'timesPerDay': 0
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with invalid time neg (should fail)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'OR',
            'timesPerDay': -12
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with invalid huge time per day (should fail)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'OR',
            'timesPerDay': 9999999
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request creation with good body (should success)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 3,
            'dose': 3,
            'unit': 'cc',
            'form': 'OR',
            'timesPerDay': 3
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(3);
        }));

    test('Request creation same treatment as before (should fail)', () => admin
        .post('/treatments')
        .send({
            'visitId': 1,
            'drugId': 3,
            'dose': 3,
            'unit': 'cc',
            'form': 'OR',
            'timesPerDay': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));
});

describe('Create treatment interruption controller tests', () => {
    test('Request treatment interuption without body (should fail)', () => admin
        .post('/treatments/interrupt')
        .send({})
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request treatment interuption with bad ID (should fail)', () => admin
        .post('/treatments/interrupt')
        .send({
            'treatmentId': 'WRONG',
            'start_date': '3 March 2010',
            'end_date': '3 March 2011',
            'reason': 7
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request treatment interuption with invalid ID (should fail)', () => admin
        .post('/treatments/interrupt')
        .send({
            'treatmentId': 999999999,
            'start_date': '3 March 2010',
            'end_date': '3 March 2011',
            'reason': 7
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Request treatment interuption with good body (should success)', () => admin
        .post('/treatments/interrupt')
        .send({
            'treatmentId': 1,
            'start_date': '3 March 2010',
            'end_date': '3 March 2011',
            'reason': 7
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(3);
        }));
});

describe('Delete treatment interruption controller tests', () => {
    test('Request deletion treatment interrupt without body (should fail)', () => admin
        .delete('/treatments/interrupt')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request deletion treatment interrupt with bad id (should fail)', () => admin
        .delete('/treatments/interrupt')
        .send({ 'treatmentInterId': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request deletion treatment interrupt with invalid id (should fail)', () => admin
        .delete('/treatments/interrupt')
        .send({ 'treatmentInterId': 99999 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));

    test('Request deletion treatment interrupt with good id (should success)', () => admin
        .delete('/treatments/interrupt')
        .send({ 'treatmentInterId': 1 })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});

describe('Delete treatment controller tests', () => {
    test('Request deletion treatment without body (should fail)', () => admin
        .delete('/treatments')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request deletion treatment with bad body (should fail)', () => admin
        .delete('/treatments')
        .send({
            'INVALID': 1,
            'WRONG': 'BAD'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Request deletion treatment with bad ID (should fail)', () => admin
        .delete('/treatments')
        .send({ 'treatmentId': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Request deletion treatment with invalid ID (should fail)', () => admin
        .delete('/treatments')
        .send({ 'treatmentId': 999999 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));

    test('Request deletion treatment with good ID (should success)', () => admin
        .delete('/treatments')
        .send({ 'treatmentId': 1 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));
});