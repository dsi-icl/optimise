/*eslint no-unused-vars: "off"*/
/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const adminToken = require('./token').adminToken;
const standardToken = require('./token').standardToken;


describe('Create treatment controller tests', () => {
    test('Request creation without body (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad body (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
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
        }));

    test('Request creation with invalid drug (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 'WRONG',
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': 3,
            'durationInWeeks': 0
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad unit (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 4,
            'dose': 3,
            'unit': 'WRONG',
            'form': 'oral',
            'timesPerDay': 3,
            'durationInWeeks': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad form (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'WRONG',
            'timesPerDay': 3,
            'durationInWeeks': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with invalid time zero (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': 0,
            'durationInWeeks': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with invalid time neg (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': -12,
            'durationInWeeks': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with invalid duration zero (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': 3,
            'durationInWeeks': 0
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with invalid duration neg (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': 3,
            'durationInWeeks': -1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with invalid duration huge (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 1,
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': 9999999,
            'durationInWeeks': -1
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with good body (should success)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 3,
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': 3,
            'durationInWeeks': 3
        })
        .then(res => {
            expect(res.status).toBe(200);
        }));

    test('Request creation same treatment as before (should fail)', () => request
        .post('/api/treatments')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'drugId': 3,
            'dose': 3,
            'unit': 'cc',
            'form': 'oral',
            'timesPerDay': 3,
            'durationInWeeks': 3
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));
});

describe('Create treatment interruption controller tests', () => {
    test('Request treatment interuption without body (should fail)', () => request
        .post('/api/treatments/interrupt')
        .set('token', adminToken)
        .send({})
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request treatment interuption with bad ID (should fail)', () => request
        .post('/api/treatments/interrupt')
        .set('token', adminToken)
        .send({
            'treatmentId': 'WRONG',
            'start_date': { 'day': 3, 'month': 4, 'year': 2010 },
            'end_date': { 'day': 3, 'month': 4, 'year': 2011 },
            'reason': 7
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request treatment interuption with invalid ID (should fail)', () => request
        .post('/api/treatments/interrupt')
        .set('token', adminToken)
        .send({
            'treatmentId': 999999999,
            'start_date': { 'day': 3, 'month': 4, 'year': 2010 },
            'end_date': { 'day': 3, 'month': 4, 'year': 2011 },
            'reason': 7
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request treatment interuption with good body (should success)', () => request
        .post('/api/treatments/interrupt')
        .set('token', adminToken)
        .send({
            'treatmentId': 1,
            'start_date': { 'day': 3, 'month': 4, 'year': 2010 },
            'end_date': { 'day': 3, 'month': 4, 'year': 2011 },
            'reason': 7
        })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});

describe('Delete treatment interruption controller tests', () => {
    test('Request deletion treatment interrupt without body (should fail)', () => request
        .delete('/api/treatments/interrupt')
        .set('token', adminToken)
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion treatment interrupt with bad id (should fail)', () => request
        .delete('/api/treatments/interrupt')
        .set('token', adminToken)
        .send({ 'treatmentInterId': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(404);
        }));

    test('Request deletion treatment interrupt with invalid id (should fail)', () => request
        .delete('/api/treatments/interrupt')
        .set('token', adminToken)
        .send({ 'treatmentInterId': 99999 })
        .then(res => {
            expect(res.status).toBe(404);
        }));

    test('Request deletion treatment interrupt with good id (should success)', () => request
        .delete('/api/treatments/interrupt')
        .set('token', adminToken)
        .send({ 'treatmentInterId': 1 })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});

describe('Delete treatment controller tests', () => {
    test('Request deletion treatment without body (should fail)', () => request
        .delete('/api/treatments')
        .set('token', adminToken)
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion treatment with bad body (should fail)', () => request
        .delete('/api/treatments')
        .set('token', adminToken)
        .send({
            'INVALID': 1,
            'WRONG': 'BAD'
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion treatment with bad ID (should fail)', () => request
        .delete('/api/treatments')
        .set('token', adminToken)
        .send({ 'treatmentId': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(404);
        }));

    test('Request deletion treatment with invalid ID (should fail)', () => request
        .delete('/api/treatments')
        .set('token', adminToken)
        .send({ 'treatmentId': 999999 })
        .then(res => {
            expect(res.status).toBe(404);
        }));

    test('Request deletion treatment with good ID (should success)', () => request
        .delete('/api/treatments')
        .set('token', adminToken)
        .send({ 'treatmentId': 1 })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});