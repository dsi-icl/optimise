const app = require('../src/app');
const request = require('supertest')(app);


const token = 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb';
const standardUserToken = '634bf7479b79aad4a5a4b3c404ea4827009833bc';



describe('Create Clinical Event controller tests', () => {
    test('Request creation whithout body (should fail)', () => {
        return request
            .post('/api/clinicalEvent')
            .set('token', token)
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            })
    });

    test('Request creation whith bad body (should fail)', () => {
        return request
            .post('/api/clinicalEvent')
            .set('token', token)
            .send({"visit_-Id":11,
                    "tYpE": 2,
                    "start_dAte":{
                        "jour":1, "mois":3, "année":2011
                    }})
            .then(res => {
                expect(res.status).toBe(400);
            })
    });

    test('Request creation whith good body (should success)', () => {
        return request
            .post('/api/clinicalEvent')
            .set('token', token)
            .send({"visitId":11,
                    "type": 2,
                    "start_date":{
                        "day":1, "month":3, "year":2011
                    }})
            .then(res => {
                expect(res.status).toBe(200);
            })
    });

    test('Request creation whith good patient and visit (should fail)', () => {
        return request
            .post('/api/clinicalEvent')
            .set('token', token)
            .send({"visitId":11,
                    "patientId":3,
                    "type":2,
                    "start_date":{
                        "day":1, "month":3, "year":2011
                    }})
            .then(res => {
                expect(res.status).toBe(200);
            })
    });

});

describe('Delete Clinical Event controller tests', () => {
    test('Request deletion whithout body (should fail)', () => {
        return request
            .delete('/api/clinicalEvent')
            .set('token', token)
            .send({})
            .then(res => {
                expect(res.status).toBe(400);
            })
    });

    test('Request deletion whith bad body (should fail)', () => {
        return request
            .delete('/api/clinicalEvent')
            .set('token', token)
            .send({"visit_-Id":11})
            .then(res => {
                expect(res.status).toBe(400);
            })
    });

    test('Request deletion whith good body (should success)', () => {
        return request
            .delete('/api/clinicalEvent')
            .set('token', token)
            .send({"ceID":2})
            .then(res => {
                expect(res.status).toBe(200);
            })
    });

    test('Request deletion whith bad ID type (should fail)', () => {
        return request
            .delete('/api/clinicalEvent')
            .set('token', token)
            .send({"ceID":"WRONG"})
            .then(res => {
                expect(res.status).toBe(400);
            })
    });

    test('Request deletion whith bad ID reference (should fail)', () => {
        return request
            .delete('/api/clinicalEvent')
            .set('token', token)
            .send({"ceID":99999999})
            .then(res => {
                expect(res.status).toBe(400);
            })
    });
});