const app = require('../src/app');
const request = require('supertest')(app);


const token = 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb';
const standardUserToken = '634bf7479b79aad4a5a4b3c404ea4827009833bc';



describe('Data controller tests', () => {
    test('input text in field that only accepts number (should fail)', () => {
        return request
            .post('/api/visit/data')
            .set('token', token)
            .send({"visitId": 1,
                "add": {"1": "BOTH", "2": 42},
                "update": {"4": 3} })
            .then(res => {
                expect(res.statusCode).toBe(400);
            })
    });

    test('input text in field that only accepts categories (should fail)', () => {
        return request
            .post('/api/visit/data')
            .set('token', token)
            .send({"visitId": 1,
                "add": {"35": 42},
                "update": {"4": 3} })
            .then(res => {
                expect(res.statusCode).toBe(400);
            })
    });

    test('updating non-existent data (should fail)', () => {
        return request
            .post('/api/visit/data')
            .set('token', token)
            .send({"visitId": 1,
                "add": {"1": 123, "2": 42},
                "update": {"4": 3} })
            .then(res => {
                expect(res.statusCode).toBe(400);
            })
    });

    test('adding new data', () => {
        return request
            .post('/api/visit/data')
            .set('token', token)
            .send({"visitId": 1,
                "add": {"1": 123, "2": 42}})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });

    test('update the added data by standard user (should fail)', () => {
        return request
            .post('/api/visit/data')
            .set('token', standardUserToken)
            .send({"visitId": 1,
                "update": {"1": 1223, "2": 422}})
            .then(res => {
                expect(res.statusCode).toBe(401);
            })
    });

    test('update the added data by admin user', () => {
        return request
            .post('/api/visit/data')
            .set('token', token)
            .send({"visitId": 1,
                "update": {"1": 1223, "2": 422}})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });

    test('delete the added data by admin user', () => {
        return request
            .delete('/api/visit/data')
            .set('token', token)
            .send({"visitId": 1,
                "delete": ["1","2"]})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });


});