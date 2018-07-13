/* global describe test expect */
const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const { connectAdmin, connectUser } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user).then();
});

describe('Create Demographic controller test', () => {
    test('Creating demographic without body', () => admin
        .post('/demographics/Demographic')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but empty property (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': null,
            'DOB': null,
            'gender': null,
            'dominant_hand': null,
            'ethnicity': null,
            'country_of_origin': null,
            'alcohol_usage': null,
            'smoking_history': null
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but badly formated property (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 'HEY',
            'DOB': 2,
            'gender': 'null',
            'dominant_hand': 'null',
            'ethnicity': 'null',
            'country_of_origin': 'null',
            'alcohol_usage': 'null',
            'smoking_history': 'null'
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong patient (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 9,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but badly formatted DOB (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': 1,
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong DOB (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '29 Feb 2001',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong gender (Should Fail)', () => admin
        .post('/demographics/Demographic')

        .send({
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 10,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong dominant hand (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominant_hand': 10,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong ethnicity (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 10,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong country of origin (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 15000,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong alcohol usage (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 10,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic with body but wrong smoking history (Should Fail)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 10
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Creating demographic well formatted (Should Works)', () => admin
        .post('/demographics/Demographic')
        .send({
            'patient': 7,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominant_hand': 1,
            'ethnicity': 1,
            'country_of_origin': 1,
            'alcohol_usage': 1,
            'smoking_history': 1
        })
        .then(res => {
            expect(res.status).toBe(200);
        }));

});

describe('Edit Demographic controller test', () => {
    test('Editing demographic without body', () => admin
        .put('/demographics/Demographic')
        .then(res => {
            expect(res.status).toBe(400);
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
            'countryOfOrigin': null,
            'alcoholUsage': null,
            'smokingHistory': null
        })
        .then(res => {
            expect(res.status).toBe(400);
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
            'countryOfOrigin': 'null',
            'alcoholUsage': 'null',
            'smokingHistory': 'null'
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but wrong id (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 80,
            'patient': 9,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));


    test('Editing demographic with body but wrong patient (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 9,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but badly formatted DOB (Should Fail)', () => admin
        .put('/demographics/Demographic')

        .send({
            'id': 8,
            'patient': 1,
            'DOB': 1,
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
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
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but wrong gender (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 10,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but wrong dominant hand (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 10,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but wrong ethnicity (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 10,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but wrong country of origin (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 15000,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but wrong alcohol usage (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 10,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic with body but wrong smoking history (Should Fail)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 8,
            'patient': 1,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 10
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Editing demographic well formatted (Should Works)', () => admin
        .put('/demographics/Demographic')
        .send({
            'id': 7,
            'patient': 7,
            'DOB': '1 Jan 1980',
            'gender': 1,
            'dominantHand': 1,
            'ethnicity': 1,
            'countryOfOrigin': 1,
            'alcoholUsage': 1,
            'smokingHistory': 1
        })
        .then(res => {
            expect(res.status).toBe(200);
        }));

});

describe('Delete Demographic controller test', () => {
    test('Deleting demographic without body', () => admin
        .delete('/demographics/Demographic')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Deleting demographic with body but empty property (Should Fail)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': null
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Deleting demographic with body but badly formated property (Should Fail)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': 'WRONG'
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Deleting demographic with body but out of bound id (Should Fail)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': 90
        })
        .then(res => {
            expect(res.status).toBe(200);
            expect(res.body).toBe(0);
        }));

    test('Deleting demographic with good preperty (Should Works)', () => admin
        .delete('/demographics/Demographic')
        .send({
            'id': 7
        })
        .then(res => {
            expect(res.status).toBe(200);
        }));

});