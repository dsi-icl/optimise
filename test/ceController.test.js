/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const { connectAdmin, connectUser, deconnectAgent } = require('./connection');

beforeAll(async() => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user).then();
});

afterAll(async() => { //eslint-disable-line no-undef
    await deconnectAgent(admin);
    await deconnectAgent(user);
});

let createCeId;

describe('Create Clinical Event controller tests', () => {
    test('Request creation whithout body (should fail)', () => admin
        .post('/clinicalEvents')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad date format (should fail)', () => admin
        .post('/clinicalEvents')
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

    test('Request creation with bad body (should fail)', () => admin
        .post('/clinicalEvents')
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

    test('Request creation with good patient and visit (should succeed)', () => admin
        .post('/clinicalEvents')
        .send({
            'visitId': 1,
            'type': 1,
            'startDate': '1 Jan 1980',
            'meddra': 1
        })
        .then(res => {
            expect(res.status).toBe(200);
            createCeId = res[0];
        }));
});

describe('Delete Clinical Event controller tests', () => {
    test('Request deletion with a standard token (should fail)', () => user
        .delete('/clinicalEvents')
        .send({ ceId: createCeId })
        .then(res => {
            expect(res.status).toBe(401);
        }));

    test('Request deletion without body (should fail)', () => admin
        .delete('/clinicalEvents')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with bad body (should fail)', () => admin
        .delete('/clinicalEvents')
        .send({ 'ce_-Id': createCeId })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with bad ID reference (should fail)', () => admin
        .delete('/clinicalEvents')
        .send({ 'ceId': 99999999 })
        .then(res => {
            expect(res.status).toBe(200);
        }));

    test('Request deletion with good body (should success)', () => admin
        .delete('/clinicalEvents')
        .send({ 'ceId': 1 })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});