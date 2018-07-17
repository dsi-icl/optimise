/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');
const { connectAdmin, connectUser, deconnectAgent } = require('./connection');

beforeAll(async () => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user).then();
});

afterAll(async () => { //eslint-disable-line no-undef
    await deconnectAgent(admin);
    await deconnectAgent(user);
});

describe('Create Pregnancy controller test', () => {
    test('Creating Pregnancy without body', () => admin
        .post('/demographics/Pregnancy')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Creating Pregnancy with body but empty property (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': null,
            'outcome': null,
            'startDate': null,
            'meddra': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Pregnancy with body but badly formated property (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': {},
            'outcome': {},
            'startDate': {},
            'meddra': {}
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Pregnancy without patient (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'outcome': 2,
            'startDate': '1 Jan 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Creating Pregnancy with wrong patient (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': {},
            'outcome': 2,
            'startDate': '1 Jan 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Pregnancy with bad patient (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 90,
            'outcome': 2,
            'startDate': '1 Jan 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Pregnancy without outcome (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 2,
            'startDate': '1 Jan 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Creating Pregnancy with wrong outcome (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 1,
            'outcome': {},
            'startDate': '1 Jan 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Pregnancy with bad outcome (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 1,
            'outcome': 1700,
            'startDate': '1 Jan 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Pregnancy without meddra (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'outcome': 2,
            'startDate': '1 Jan 2000',
            'patient': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Creating Pregnancy with wrong patient (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 1,
            'outcome': 2,
            'startDate': '1 Jan 2000',
            'meddra': {}
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Pregnancy with bad meddra (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 90,
            'outcome': 2,
            'startDate': '1 Jan 2000',
            'meddra': 3000000
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Pregnancy with bad startDate (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 90,
            'outcome': 2,
            'startDate': '31 Feb 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Pregnancy well formatted (Should Works)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            'patient': 1,
            'outcome': 2,
            'startDate': '1 Jan 2000',
            'meddra': 3
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(3);
        }));

});

describe('Edit Pregnancy controller test', () => {
    test('Editing Pregnancy without body', () => admin
        .put('/demographics/Pregnancy')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing Pregnancy with body but empty property (Should Fail)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            'id': null,
            'outcome': 4
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Pregnancy with body but badly formated property (Should Fail)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            'id': 'WRONG',
            'outcome': 4
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Pregnancy with body but wrong id (Should Fail)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            'id': 90,
            'outcome': 4
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));

    test('Editing Pregnancy well formatted (Should Works)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            'id': 3,
            'outcome': 4
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

});

describe('Delete Pregnancy controller test', () => {
    test('Deleting Pregnancy without body', () => admin
        .delete('/demographics/Pregnancy')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Deleting Pregnancy with body but empty property (Should Fail)', () => admin
        .delete('/demographics/Pregnancy')
        .send({
            'id': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Deleting Pregnancy with body but badly formated property (Should Fail)', () => admin
        .delete('/demographics/Pregnancy')
        .send({
            'id': 'WRONG'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Deleting Pregnancy with body but out of bound id (Should Fail)', () => admin
        .delete('/demographics/Pregnancy')
        .send({
            'id': 90
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));

    test('Deleting Pregnancy with good preperty (Should Works)', () => admin
        .delete('/demographics/Pregnancy')
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