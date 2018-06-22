/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const tokens = require('./token');
const token = tokens.token;
const standardToken = tokens.standardToken;


const ExportController = require('../src/controllers/exportController');

describe('Export database tests', () => {
    test('Export all demographics', () => request
        .get('/api/exportDb')
        //.set('token', token)
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/csv; charset=utf-8');
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        }));



});