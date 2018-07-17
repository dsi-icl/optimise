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

describe('Create Medical Historycontroller test', () => {
    test('Creating Medical Historywithout body', () => admin
        .post('/demographics/MedicalCondition')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Creating Medical Historywith body but empty property (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': null,
            'relation': null,
            'conditionName': null,
            'startDate': null,
            'outcome': null,
            'resolvedYear': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Medical Historywith body but badly formated property (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 'WRONG',
            'relation': 'Wrong',
            'conditionName': 'WRONG',
            'startDate': 0,
            'outcome': 0,
            'resolvedYear': '2002'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Medical Historywith body but wrong patient (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 100,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Medical Historywith body but wrong relations (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 'Wrong',
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Medical Historywith body but bad relations (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 100,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Medical Historywith body but wrong condition (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 1,
            'conditionName': 'WRONG',
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Medical Historywith body but bad condition (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 1,
            'conditionName': 400,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
        }));

    test('Creating Medical Historywith body but badly formatted startDate (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': 0,
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Medical Historywith body but wrong outcome (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 0,
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Medical Historywith body but wrong resolved year (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': '2002'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Creating Medical Historywell formatted (Should Works)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(4);
        }));

});

describe('Edit Medical Historycontroller test', () => {
    test('Editing Medical Historywithout body', () => admin
        .put('/demographics/MedicalCondition')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing Medical Historywith body but empty property (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': null,
            'patient': null,
            'relation': null,
            'conditionName': null,
            'startDate': null,
            'outcome': null,
            'resolvedYear': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Medical Historywith body but badly formated property (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 'WRONG',
            'patient': 'WRONG',
            'relation': 'Wrong',
            'conditionName': 'WRONG',
            'startDate': 0,
            'outcome': 0,
            'resolvedYear': '2002'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Medical Historywith body but wrong patient (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 100,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));

    test('Editing Medical Historywith body but wrong relations (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 1,
            'relation': 'Wrong',
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));

    test('Editing Medical Historywith body but bad relations (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 1,
            'relation': 100,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));

    test('Editing Medical Historywith body but wrong condition (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 1,
            'relation': 1,
            'conditionName': 'WRONG',
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));

    test('Editing Medical Historywith body but bad condition (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 1,
            'relation': 1,
            'conditionName': 400,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.UPDATEFAIL);
        }));

    test('Editing Medical Historywith body but badly formatted startDate (Should Success - startDate is nullable)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': 0,
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Editing Medical Historywith body but wrong outcome (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 0,
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Medical Historywith body but wrong resolved year (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 4,
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': '2002'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Editing Medical Historywell formatted (Should Works)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            'id': 1,
            'patient': 1,
            'relation': 1,
            'conditionName': 1,
            'startDate': '1/1/2001',
            'outcome': 'resolved',
            'resolvedYear': 2002
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

});

describe('Delete Medical Historycontroller test', () => {
    test('Deleting Medical Historywithout body', () => admin
        .delete('/demographics/MedicalCondition')
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
        }));

    test('Deleting Medical Historywith body but empty property (Should Fail)', () => admin
        .delete('/demographics/MedicalCondition')
        .send({
            'id': null
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Deleting Medical Historywith body but badly formated property (Should Fail)', () => admin
        .delete('/demographics/MedicalCondition')
        .send({
            'id': 'WRONG'
        })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
        }));

    test('Deleting Medical Historywith body but out of bound id (Should Fail)', () => admin
        .delete('/demographics/MedicalCondition')
        .send({
            'id': 90
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(0);
        }));

    test('Deleting Medical Historywith good preperty (Should Works)', () => admin
        .delete('/demographics/MedicalCondition')
        .send({
            'id': 1
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));
});