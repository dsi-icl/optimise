/* global beforeAll afterAll describe test expect */


import request from 'supertest';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
import message from '../src/utils/message-utils';
import { connectAdmin, connectUser, disconnectAgent } from './connection';

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Create Demographic controller test', () => {
    test('Creating demographic without body', () => admin
        .post('/demographics/Demographic')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating demographic with body but empty property (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': null,
            'DOB': null,
            'gender': null,
            'dominant_hand': null,
            'ethnicity': null,
            'country_of_origin': null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating demographic with body but badly formated property (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 'HEY',
            'DOB': 2,
            'gender': 'null',
            'dominant_hand': 'null',
            'ethnicity': 'null',
            'country_of_origin': 'null'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating demographic with body but wrong patient (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 90,
            'DOB': '2001-02-25',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating demographic with body but badly formatted DOB (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': 1,
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating demographic with body but wrong DOB (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '2001-02-29',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.dateError[2]);
            return true;
        }));

    test('Creating demographic with body but wrong gender (Should Fail)', () => admin
        .post('/demographics/Demographic')

        .send({
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 10,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating demographic with body but wrong dominant hand (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominant_hand': 10,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating demographic with body but wrong ethnicity (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 10,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating demographic with body but wrong country of origin (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 15000
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating demographic with body but wrong alcohol usage (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating demographic with body but wrong smoking history (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Creating demographic well formatted (Should Succeed)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 7,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(7);
            return true;
        }));

});

describe('Edit Demographic controller test', () => {
    test('Editing demographic without body', () => admin
        .put('/demographics/Demographic')
        .then(({ status }) => {
            expect(status).toBe(400);
            return true;
        }));

    test('Editing demographic with body but empty property (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': null,
            'patient': null,
            'DOB': null,
            'gender': null,
            'dominantHand': null,
            'ethnicity': null,
            'countryOfOrigin': null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing demographic with body but badly formated property (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 'WRONG',
            'patient': 'HEY',
            'DOB': 2,
            'gender': 'null',
            'dominantHand': 'null',
            'ethnicity': 'null',
            'countryOfOrigin': 'null'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing demographic with body but wrong id (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 80,
            'patient': 9,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));


    test('Editing demographic with body but wrong patient (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 9,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing demographic with body but badly formatted DOB (Should Fail)', () => admin
        .put('/demographics/Demographic')

        .send({
            'id': 8,
            'patient': 1,
            'DOB': 'have',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.INVALIDDATE);
            return true;
        }));

    test('Editing demographic with body but wrong DOB (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': { 'day': 29, 'month': 2, 'year': 2001 },
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.INVALIDDATE);
            return true;
        }));

    test('Editing demographic with body but wrong gender (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 10,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing demographic with body but wrong dominant hand (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 10,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing demographic with body but wrong ethnicity (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 10,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing demographic with body but wrong country of origin (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 15000
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing demographic with body but wrong alcohol usage (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing demographic with body but wrong smoking history (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.UPDATEFAIL);
            return true;
        }));

    test('Editing demographic well formatted (Should Succeed)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 7,
            'patient': 7,
            'DOB': '1980-01-01',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

});

describe('Delete Demographic controller test', () => {
    test('Deleting demographic without body', () => admin
        .delete('/demographics/Demographic')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Deleting demographic with body but empty property (Should Fail)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Deleting demographic with body but badly formated property (Should Fail)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': 'WRONG'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Deleting demographic with body but out of bound id (Should Fail)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': 90
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(0);
            return true;
        }));

    test('Deleting demographic with good preperty (Should Succeed)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': 2
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));
});