/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const FormData = require('form-data');
const { connectAdmin, disconnectAgent } = require('./connection');
const fs = require('fs');

beforeAll(async () => {
    await connectAdmin(admin);
});

afterAll(async () => {
    await disconnectAgent(admin);
});

describe('Meddra upload tests', () => {
    test('Initially the meddra code database is empty', () => admin
        .get('/meddra')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
            return true;
        })
    );

    test('Uploading mdhier.asc', () => {
        const form = new FormData();
        form.append('mdhierfile', fs.createReadStream('./file/mdhier.asc'));
        return admin
            .post('/uploadMeddra')
            .send(form)
            .then(res => {
                expect(res.statusCode).toBe(200);
                return true;
            });
    });

    // test('meddra code database is filled', () => admin
    //     .get('/meddra')
    //     .then(res => {
    //         expect(res.statusCode).toBe(200);
    //         expect(res.body.length).toBe(0);
    //         return true;
    //     })
    // );

});