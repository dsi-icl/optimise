/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const tokens = require('./token');
const token = tokens.token;


describe('Create test controller tests', () => {
    test('Request creation whithout body (should fail)', () => request
        .post('/api/test')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation whith bad body (should fail)', () => request
        .post('/api/test')
        .set('token', token)
        .send({ 'vis': 1, 'teep': 1, 'Date': { 'day': 1, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation whith good body (should success)', () => request
        .post('/api/test')
        .set('token', token)
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': { 'day': 1, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(200);
        }));

});

describe('Create test add occurence date controller tests', () => {
    test('Request creation add occurence date whith bad body (should fail)', () => request
        .post('/api/test')
        .set('token', token)
        .send({ 'vis': 1, 'teep': 1, 'Date': { 'day': 1, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation add occurence date whith good body (should success)', () => request
        .post('/api/test')
        .set('token', token)
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': { 'day': 1, 'month': 1, 'year': 2020 }, 'actualOccurredDate': { 'day': 4, 'month': 1, 'year': 2020 } })
        .then(res => {
            expect(res.status).toBe(200);
        }));

});

describe('Delete test controller tests', () => {
    test('Request deletion whithout body (should fail)', () => request
        .delete('/api/test')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion whith bad body (should fail)', () => request
        .post('/api/test')
        .set('token', token)
        .send({ 'visit_-Id': 11 })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion whith good body (should success)', () => request
        .delete('/api/test')
        .set('token', token)
        .send({ 'testID': 2 })
        .then(res => {
            expect(res.status).toBe(200);
        }));

    test('Request deletion whith bad ID type (should fail)', () => request
        .delete('/api/test')
        .set('token', token)
        .send({ 'testID': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion whith bad ID reference (should fail)', () => request
        .delete('/api/test')
        .set('token', token)
        .send({ 'testID': 99999999 })
        .then(res => {
            expect(res.status).toBe(400);
        }));
});
