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

describe('Create Pregnancy controller test', () => {
    test('Creating Pregnancy without body', () => admin
        .post('/demographics/Pregnancy')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating Pregnancy with body but empty property (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: null,
            outcome: null,
            startDate: null
            // 'meddra': null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Pregnancy with body but badly formated property (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: {},
            outcome: {},
            startDate: {}
            // 'meddra': {}
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Pregnancy without patient (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            outcome: 2,
            startDate: '2000-01-01'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating Pregnancy with wrong patient (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: {},
            outcome: 2,
            startDate: '2000-01-01'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Pregnancy with bad patient (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 90,
            outcome: 2,
            startDate: '2000-01-01'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating Pregnancy with wrong outcome (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 1,
            outcome: {},
            startDate: '2000-01-01'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Pregnancy with bad outcome (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 1,
            outcome: 1700,
            startDate: '2000-01-01'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating Pregnancy with wrong MedDRA type (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 1,
            outcome: 2,
            startDate: '2000-01-01',
            meddra: {}
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating Pregnancy with non-existing MedDRA (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 1,
            outcome: 2,
            startDate: '2000-01-01',
            meddra: 3000000
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating Pregnancy with bad startDate (Should Fail)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 1,
            outcome: 2,
            startDate: 'xx1337xx'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.INVALIDDATE);
            return true;
        }));

    test('Creating Pregnancy well formatted (Should Succeed)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 1,
            outcome: 2,
            outcomeDate: '2000-05-14',
            startDate: '2000-01-01'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(3);
            return true;
        }));

    test('Creating Pregnancy well formatted with no MedDRA (Should Succeed)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 3,
            outcomeDate: '2000-05-14',
            outcome: 2,
            startDate: '1989-03-04'
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(4);
            return true;
        }));


    test('Creating Pregnancy without outcome (Should Succeed)', () => admin
        .post('/demographics/Pregnancy')
        .send({
            patient: 2,
            startDate: '2000-01-01'
            // 'meddra': 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(5);
            return true;
        }));
});

describe('Edit Pregnancy controller test', () => {
    test('Editing Pregnancy without body', () => admin
        .put('/demographics/Pregnancy')
        .then(({ status }) => {
            expect(status).toBe(400);
            return true;
        }));

    test('Editing Pregnancy with body but empty property (Should Fail)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            id: null,
            outcome: 4
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing Pregnancy with body but badly formated property (Should Fail)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            id: 'WRONG',
            outcome: 4
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing Pregnancy with body but wrong id (Should Fail)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            id: 90,
            outcome: 4
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing Pregnancy well formatted (Should Succeed)', () => admin
        .put('/demographics/Pregnancy')
        .send({
            id: 3,
            outcome: 4
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

});

describe('Delete Pregnancy controller test', () => {
    test('Deleting Pregnancy without body', () => admin
        .delete('/demographics/Pregnancy')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Deleting Pregnancy with body but empty property (Should Fail)', () => admin
        .delete('/demographics/Pregnancy')
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

    test('Deleting Pregnancy with body but badly formated property (Should Fail)', () => admin
        .delete('/demographics/Pregnancy')
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

    test('Deleting Pregnancy with body but out of bound id (Should Fail)', () => admin
        .delete('/demographics/Pregnancy')
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

    test('Deleting Pregnancy with good preperty (Should Succeed)', () => admin
        .delete('/demographics/Pregnancy')
        .send({
            id: 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));
});