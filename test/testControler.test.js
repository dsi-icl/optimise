/* global describe test expect */
const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const { connectAdmin, connectUser } = require('./connection');

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user).then();
});

let createdTestId;

describe('Create test controller tests', () => {
    test('Request creation without body (should fail)', () => admin
        .post('/tests')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with bad body (should fail)', () => admin
        .post('/tests')
        .send({ 'vis': 1, 'teep': 1, 'Date': '1 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation with good body (should success)', () => admin
        .post('/tests')
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': '1 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(200);
            createdTestId = res[0];
        }));

});

describe('Create test add occurence date controller tests', () => {
    test('Request creation add occurence date with bad body (should fail)', () => admin
        .post('/tests')
        .send({ 'vis': 1, 'teep': 1, 'Date': '1 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request creation add occurence date with good body (should success)', () => admin
        .post('/tests')
        .send({ 'visitId': 1, 'type': 1, 'expectedDate': '12 Jan 2020', 'actualOccurredDate': '4 Jan 2020' })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});

describe('Delete test controller tests', () => {
    test('Request deletion without body (should fail)', () => admin
        .patch('/tests')
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with bad body (should fail)', () => admin
        .patch('/tests')
        .send({ 'visit_-Id': createdTestId })
        .then(res => {
            expect(res.status).toBe(400);
        }));

    test('Request deletion with good body by standard User (should fail)', () => user
        .patch('/tests')
        .send({ 'testID': createdTestId })
        .then(res => {
            expect(res.status).toBe(401);
        }));

    test('Request deletion with bad ID type (should fail)', () => admin
        .patch('/tests')
        .send({ 'testID': 'WRONG' })
        .then(res => {
            expect(res.status).toBe(200);
        }));

    test('Request deletion with bad ID reference (should fail)', () => admin
        .patch('/tests')
        .send({ 'testID': 99999999 })
        .then(res => {
            expect(res.status).toBe(200);
        }));

    test('Request deletion with good body (should success)', () => admin
        .patch('/tests')
        .send({ 'testID': 4 })
        .then(res => {
            expect(res.status).toBe(200);
        }));
});
