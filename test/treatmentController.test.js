/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);

const token = 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb';
const standardUserToken = '634bf7479b79aad4a5a4b3c404ea4827009833bc';

describe('Create treatment controller tests', () => {
    test('Request creation without body (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request creation with bad body (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'aaaa': 11,
                'bbbb': 1,
                'cccc': 3,
                'dddd': 'cc',
                'eeee': 'oral',
                'ffff': 3,
                'gggg': 3
            })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request creation with invalid drug (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 'WRONG',
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': 3,
                'durationInWeeks': 0
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with bad unit (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'WRONG',
                'form': 'oral',
                'timesPerDay': 3,
                'durationInWeeks': 3
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with bad form (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'WRONG',
                'timesPerDay': 3,
                'durationInWeeks': 3
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with invalid time zero (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': 0,
                'durationInWeeks': 3
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with invalid time neg (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': -12,
                'durationInWeeks': 3
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with invalid time huge (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': 999999,
                'durationInWeeks': 3
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with invalid duration zero (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': 3,
                'durationInWeeks': 0
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with invalid duration neg (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': 3,
                'durationInWeeks': -1
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with invalid duration huge (should fail)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': 9999999,
                'durationInWeeks': -1
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

    test('Request creation with good body (should success)', () => {
        return request
            .post('/api/treatments')
            .set('token', token)
            .send({
                'visitId': 11,
                'drugId': 1,
                'dose': 3,
                'unit': 'cc',
                'form': 'oral',
                'timesPerDay': 3,
                'durationInWeeks': 3
            })
            .then(res => {
                expect(res.status).toBe(200);
            });
    });

});

describe('Delete treatment controller tests', () => {
    test('Request deletion treatment without body (should fail)', () => {
        return request
            .delete('/api/treatments')
            .set('token', token)
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment with bad body (should fail)', () => {
        return request
            .delete('/api/treatments')
            .set('token', token)
            .send({
                'INVALID': 1,
                'WRONG': 'BAD'
            })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment with bad ID (should fail)', () => {
        return request
            .delete('/api/treatments')
            .set('token', token)
            .send({ 'treatmentId': 'WRONG' })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment with invalid ID (should fail)', () => {
        return request
            .delete('/api/treatments')
            .set('token', token)
            .send({ 'treatmentId': 999999 })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment with good ID (should success)', () => {
        return request
            .delete('/api/treatments')
            .set('token', token)
            .send({ 'treatmentId': 5 })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });
});

describe('Create treatment interruption controller tests', () => {
    test('Request treatment interuption without body (should fail)', () => {
        return request
            .post('/api/treatments/interrupt')
            .set('token', token)
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request treatment interuption with bad body (should fail)', () => {
        return request
            .post('/api/treatments/interrupt')
            .set('token', token)
            .send({ 'wrong': 1 })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request treatment interuption with bad ID (should fail)', () => {
        return request
            .post('/api/treatments/interrupt')
            .set('token', token)
            .send({ 'treatmentId': 'WRONG' })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request treatment interuption with invalid ID (should fail)', () => {
        return request
            .post('/api/treatments/interrupt')
            .set('token', token)
            .send({ 'treatmentId': 99999 })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request treatment interuption with good body (should success)', () => {
        return request
            .post('/api/treatments/interrupt')
            .set('token', token)
            .send({ 'treatmentId': 5 })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });
});

describe('Delete treatment interruption controller tests', () => {
    test('Request deletion treatment interrupt without body (should fail)', () => {
        return request
            .delete('/api/treatments/interrupt')
            .set('token', token)
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment interrupt with bad body (should fail)', () => {
        return request
            .delete('/api/treatments/interrupt')
            .set('token', token)
            .send({
                'wrong': 'bad',
                'bad2': 0
            })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment interrupt with bad id (should fail)', () => {
        return request
            .delete('/api/treatments/interrupt')
            .set('token', token)
            .send({ 'treatmentInterId': 'WRONG' })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment interrupt with invalid id (should fail)', () => {
        return request
            .delete('/api/treatments/interrupt')
            .set('token', token)
            .send({ 'treatmentInterId': 99999 })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

    test('Request deletion treatment interrupt with good id (should success)', () => {
        return request
            .delete('/api/treatments/interrupt')
            .set('token', token)
            .send({ 'treatmentInterId': 5 })
            .then(res => {
                expect(res.status).toBe(400);
            });
    });

});