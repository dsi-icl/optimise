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

describe('Create Medical History controller test', () => {
    test('Creating Medical History without body', () => admin
        .post('/demographics/MedicalCondition')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating Medical History with body but empty property (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: null,
            relation: null,
            conditionName: null,
            startDate: null,
            outcome: null,
            resolvedYear: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Medical History with body but badly formated property (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 'WRONG',
            relation: 'Wrong',
            conditionName: 'WRONG',
            startDate: 0,
            outcome: 0,
            resolvedYear: '2002'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Medical History with body but wrong patient (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 100,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating Medical History with body but wrong relations (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 'Wrong',
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Medical History with body but bad relations (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 100,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating Medical History with body but wrong condition (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 1,
            conditionName: 'WRONG',
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Medical History with body but bad condition (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 1,
            conditionName: 400,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating Medical History with body but badly formatted startDate (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: 0,
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Medical History with body but wrong outcome (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 0,
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Medical History with body but wrong resolved year (Should Fail)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: '2002'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Medical History well formatted (Should Succeed)', () => admin
        .post('/demographics/MedicalCondition')
        .send({
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(4);
            return true;
        }));

});

describe('Edit Medical History controller test', () => {
    test('Editing Medical Historywithout body', () => admin
        .put('/demographics/MedicalCondition')
        .then(({ status }) => {
            expect(status).toBe(400);
            return true;
        }));

    test('Editing Medical History with body but empty property (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: null,
            patient: null,
            relation: null,
            conditionName: null,
            startDate: null,
            outcome: null,
            resolvedYear: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing Medical History with body but badly formated property (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 'WRONG',
            patient: 'WRONG',
            relation: 'Wrong',
            conditionName: 'WRONG',
            startDate: 0,
            outcome: 0,
            resolvedYear: '2002'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing Medical History with body but wrong patient (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 100,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing Medical History with body but wrong relations (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 1,
            relation: 'Wrong',
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing Medical History with body but bad relations (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 1,
            relation: 100,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing Medical History with body but wrong condition (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 1,
            relation: 1,
            conditionName: 'WRONG',
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing Medical History with body but bad condition (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 1,
            relation: 1,
            conditionName: 400,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing Medical History with body but badly formatted startDate (should succeed - startDate is nullable)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: 0,
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Editing Medical History with body but wrong outcome (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 0,
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing Medical History with body but wrong resolved year (Should Fail)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 4,
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: '2002'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing Medical History well formatted (Should Succeed)', () => admin
        .put('/demographics/MedicalCondition')
        .send({
            id: 1,
            patient: 1,
            relation: 1,
            conditionName: 1,
            startDate: '1980-01-01',
            outcome: 'resolved',
            resolvedYear: 2002
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

});

describe('Delete Medical History controller test', () => {
    test('Deleting Medical History without body', () => admin
        .delete('/demographics/MedicalCondition')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Deleting Medical History with body but empty property (Should Fail)', () => admin
        .delete('/demographics/MedicalCondition')
        .send({
            id: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Deleting Medical History with body but badly formated property (Should Fail)', () => admin
        .delete('/demographics/MedicalCondition')
        .send({
            id: 'WRONG'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Deleting Medical History with body but out of bound id (Should Fail)', () => admin
        .delete('/demographics/MedicalCondition')
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

    test('Deleting Medical History with good preperty (Should Succeed)', () => admin
        .delete('/demographics/MedicalCondition')
        .send({
            id: 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));
});