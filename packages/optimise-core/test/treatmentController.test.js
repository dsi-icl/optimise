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


describe('Create treatment controller tests', () => {
    test('Request creation without body (should fail)', () => admin
        .post('/treatments')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with bad body (should fail)', () => admin
        .post('/treatments')

        .send({
            aaaa: 11,
            bbbb: 1,
            cccc: 3,
            dddd: 'cc',
            eeee: 'OR',
            ffff: 3,
            gggg: 3
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with invalid drug (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 'WRONG',
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: 1,
            intervalUnit: 'day',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with bad dose (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: 'xxx',
            unit: 'cc',
            form: 'IV',
            times: 1,
            intervalUnit: 'day',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with negative dose (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: -3,
            unit: 'cc',
            form: 'IV',
            times: 1,
            intervalUnit: 'day',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with bad unit (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 4,
            dose: 3,
            unit: 'WRONG',
            form: 'OR',
            times: 1,
            intervalUnit: 'day',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with bad form (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: 3,
            unit: 'cc',
            form: 'WRONG',
            times: 1,
            intervalUnit: 'day',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with large number for times (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: 9999,
            intervalUnit: 'day',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with negative times (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: -9,
            intervalUnit: 'day',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with invalid intervalUnit (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: 2,
            intervalUnit: 'WRONG',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with valid times but no intervalUnit (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: 1,
            intervalUnit: null,
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with valid intervalUnit but no times (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 1,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: null,
            intervalUnit: 'year',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request creation with no start date (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 3,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: 4,
            intervalUnit: 'year'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request creation with good body (should succeed)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 3,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: 4,
            intervalUnit: 'year',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(3);
            return true;
        }));

    test('Request creation same treatment as before (should fail)', () => admin
        .post('/treatments')
        .send({
            visitId: 1,
            drugId: 3,
            dose: 3,
            unit: 'cc',
            form: 'OR',
            times: 4,
            intervalUnit: 'year',
            startDate: '2018-03-03'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));
});

describe('Create treatment interruption controller tests', () => {
    test('Request treatment interuption without body (should fail)', () => admin
        .post('/treatments/interrupt')
        .send({})
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request treatment interuption with bad ID (should fail)', () => admin
        .post('/treatments/interrupt')
        .send({
            treatmentId: 'WRONG',
            start_date: '2010-03-03',
            end_date: '2011-03-03',
            reason: 7
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request treatment interuption with invalid ID (should fail)', () => admin
        .post('/treatments/interrupt')
        .send({
            treatmentId: 999999999,
            start_date: '2010-03-03',
            end_date: '2011-03-03',
            reason: 7
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Request treatment interuption with good body (should succeed)', () => admin
        .post('/treatments/interrupt')
        .send({
            treatmentId: 1,
            start_date: '2010-03-03',
            end_date: '2011-03-03',
            reason: 7
            // 'meddra': 5
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(3);
            return true;
        }));
});


describe('Update treatment interruption controller tests', () => {
    test('Update treatment interuption without body (should fail)', () => admin
        .post('/treatments/interrupt')
        .send({})
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Update treatment interuption with bad ID (should fail)', () => admin
        .put('/treatments/interrupt')
        .send({
            treatmentInterId: 'WRONG',
            start_date: '2010-03-03',
            end_date: '2011-03-03',
            reason: 7
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Update treatment interuption with invalid ID (should fail)', () => admin
        .put('/treatments/interrupt')
        .send({
            treatmentInterId: 999999999,
            start_date: '2010-03-03',
            end_date: '2011-03-03',
            reason: 7
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Update treatment interuption with good body (should succeed)', () => admin
        .put('/treatments/interrupt')
        .send({
            treatmentInterId: 1,
            start_date: '2014-03-03',
            end_date: '2015-03-03',
            reason: 2
            // 'meddra': 25
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Update treatment interuption with good body second pass (should succeed)', () => admin
        .put('/treatments/interrupt')
        .send({
            treatmentInterId: 1,
            start_date: '2014-03-03'
            // 'meddra': 35
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Update treatment interuption with missing values (should fail)', () => admin
        .put('/treatments/interrupt')
        .send({
            treatmentInterId: 1
            // 'meddra': 35
        })
        .then(({ status, error, body }) => {
            expect(status).toBe(400);
            expect(typeof error).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));
});

describe('Delete treatment interruption controller tests', () => {
    test('Request deletion treatment interrupt without body (should fail)', () => admin
        .delete('/treatments/interrupt')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion treatment interrupt with bad id (should fail)', () => admin
        .delete('/treatments/interrupt')
        .send({ treatmentInterId: 'WRONG' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request deletion treatment interrupt with invalid id (should fail)', () => admin
        .delete('/treatments/interrupt')
        .send({ treatmentInterId: 99999 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));

    test('Request deletion treatment interrupt with good id (should succeed)', () => admin
        .delete('/treatments/interrupt')
        .send({ treatmentInterId: 1 })
        .then(({ status }) => {
            expect(status).toBe(200);
            return true;
        }));
});

describe('Delete treatment controller tests', () => {
    test('Request deletion treatment without body (should fail)', () => admin
        .delete('/treatments')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion treatment with bad body (should fail)', () => admin
        .delete('/treatments')
        .send({
            INVALID: 1,
            WRONG: 'BAD'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Request deletion treatment with bad ID (should fail)', () => admin
        .delete('/treatments')
        .send({ treatmentId: 'WRONG' })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Request deletion treatment with invalid ID (should fail)', () => admin
        .delete('/treatments')
        .send({ treatmentId: 999999 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));

    test('Request deletion treatment with good ID (should succeed)', () => admin
        .delete('/treatments')
        .send({ treatmentId: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));
});