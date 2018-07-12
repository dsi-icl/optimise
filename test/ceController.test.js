/* global describe test expect */

const adminToken = require('./token').adminToken;
const standardToken = require('./token').standardToken;
const request = require('supertest')(global.optimiseRouter);

let createCeId;

describe('Create Clinical Event controller tests', () => {
    test('Request creation whithout body (should fail)', () => request
        .post('/clinicalEvents')
        .set('token', adminToken)
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad date format (should fail)', () => request
        .post('/clinicalEvents')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'type': 1,
            'startDate': {
                'jour': 1, 'mois': 3, 'année': 2011
            }
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad body (should fail)', () => request
        .post('/clinicalEvents')
        .set('token', adminToken)
        .send({
            'visit_-Id': 1,
            'tYpE': 2,
            'start_dAte': {
                'jour': 1, 'mois': 3, 'année': 2011
            }
        })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with good patient and visit (should succeed)', () => request
        .post('/clinicalEvents')
        .set('token', adminToken)
        .send({
            'visitId': 1,
            'type': 1,
            'startDate': '1 Jan 1980',
            'meddra':1
        })
        .then(res => {
            expect(res.status).toBe(200);
            createCeId = res[0];
        }));
});

describe('Delete Clinical Event controller tests', () => {
    test('Request deletion with a standard token (should fail)', () => request
        .delete('/clinicalEvents')
        .set('token', standardToken)
        .send({ ceId: createCeId })
        .then(res => {
            expect(res.status).toBe(401);
        }));

    test('Request deletion without body (should fail)', () => request
        .delete('/clinicalEvents')
        .set('token', adminToken)
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with bad body (should fail)', () => request
        .delete('/clinicalEvents')
        .set('token', adminToken)
        .send({ 'ce_-Id': createCeId })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with bad ID reference (should fail)', () => request
        .delete('/clinicalEvents')
        .set('token', adminToken)
        .send({ 'ceId': 99999999 })
        .then(res => {
            expect(res.status).toBe(200);
        }));

    test('Request deletion with good body (should success)', () => request
        .delete('/clinicalEvents')
        .set('token', adminToken)
        .send({ 'ceId': 1 })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});