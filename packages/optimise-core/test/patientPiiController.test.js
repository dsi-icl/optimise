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

describe('Create PII controller test', () => {
    test('Create PII without body', () =>
        admin.post('/patientPii/')
            .send({})
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            })
    );

    test('Create PII without patient', () =>
        admin.post('/patientPii/')
            .send({
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            })
    );

    test('Create PII with wrong patient', () =>
        admin.post('/patientPii/')
            .send({
                patient: {},
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            })
    );

    test('Create PII with bad patient', () =>
        admin.post('/patientPii/')
            .send({
                patient: 90,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
                return true;
            })
    );

    test('Create PII without firstname', () =>
        admin.post('/patientPii/')
            .send({
                patient: 2,
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            })
    );

    test('Create PII with wrong firstname', () =>
        admin.post('/patientPii/')
            .send({
                patient: 2,
                firstName: {},
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            })
    );

    test('Create PII without surname', () =>
        admin.post('/patientPii/')
            .send({
                patient: 2,
                firstName: 'Chon',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            })
    );

    test('Create PII with wrong surname', () =>
        admin.post('/patientPii/')
            .send({
                patient: 2,
                firstName: 'Chon',
                surname: {},
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            })
    );

    test('Create PII without address', () =>
        admin.post('/patientPii/')
            .send({
                patient: 2,
                firstName: 'Chon',
                surname: 'Sou',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            })
    );

    test('Create PII with wrong fullAddress', () =>
        admin.post('/patientPii/')
            .send({
                patient: 2,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: {},
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            })
    );

    test('Create PII with good parameters', () =>
        admin.post('/patientPii/')
            .send({
                patient: 2,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(200);
                expect(typeof body).toBe('object');
                expect(body.state).toBeDefined();
                expect(body.state).toBe(3);
                return true;
            })
    );

});

describe('Fetching PII', () => {
    test('Fetching', () =>
        admin.get('/patientPii/?patient=2')
            .then(({ status, body }) => {
                expect(status).toBe(200);
                expect(typeof body).toBe('object');
                expect(body.length).toBe(1);
                expect(body[0].firstName).toBe('Chon');
                expect(body[0].surname).toBe('Sou');
                expect(body[0].postcode).toBe('W6 ICL');
                return true;
            }));
});

describe('Editing PII test suite', () => {
    test('Editing with empty body', () =>
        admin.put('/patientPii/')
            .send({})
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Editing without id parameter', () =>
        admin.put('/patientPii/')
            .send({
                patient: 1,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Editing with wrong id', () =>
        admin.put('/patientPii/')
            .send({
                id: {},
                patient: 1,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            }));

    test('Editing with bad id', () =>
        admin.put('/patientPii/')
            .send({
                id: 90,
                patient: 1,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
                return true;
            }));

    test('Editing with bad patient', () =>
        admin.put('/patientPii/')
            .send({
                id: 3,
                patient: 90,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
                return true;
            }));

    test('Editing with good parameters', () =>
        admin.put('/patientPii/')
            .send({
                id: 1,
                patient: 1,
                firstName: 'Chon',
                surname: 'Sou',
                fullAddress: 'ICL, South Kensington, London',
                postcode: 'W6 ICL'
            })
            .then(({ status, body }) => {
                expect(status).toBe(200);
                expect(typeof body).toBe('object');
                expect(body.state).toBeDefined();
                expect(body.state).toBe(1);
                return true;
            }));
});

describe('Delete PII test suite', () => {
    test('Deleting with empty body', () =>
        admin.delete('/patientPii/')
            .send({
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.MISSINGARGUMENT);
                return true;
            }));

    test('Deleting with wrong id', () =>
        admin.delete('/patientPii/')
            .send({
                id: {}
            })
            .then(({ status, body }) => {
                expect(status).toBe(400);
                expect(typeof body).toBe('object');
                expect(body.error).toBeDefined();
                expect(body.error).toBe(message.userError.WRONGARGUMENTS);
                return true;
            }));

    test('Deleting with bad id', () =>
        admin.delete('/patientPii/')
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

    test('Deleting with good parameters', () =>
        admin.delete('/patientPii/')
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