const app = require('../src/app');
const request = require('supertest')(app);

const VisitController = require('../src/controllers/visitController');


const token = 'd86d6e50ade67a3a0569ebc84d6041ea9bac36cb';



describe('Visit controller tests', () => {
    test('getting visits of a patient', () => {
        return request
            .get('/api/visits?patientId=florian')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body.length).toBeGreaterThanOrEqual(1);
            })
    });

    test('getting visits of a patient that does not have visit', () => {
        return request
            .get('/api/visits?patientId=chon')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body.length).toBe(0);
            })
    });

    test('getting visits of a patient that does not have visit', () => {
        return request
            .get('/api/visits?patientId=chon')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body.length).toBe(0);
            })
    });

    test('creating visit for a patient', () => {
        return request
            .post('/api/visits/create')
            .set('token', token)
            .send({
                "patientId": "chon",
                "visitDate": {"date": 29, "month": 2, "year": 2000}
            })
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            })
    });

    test('creating visit for a patient with malformed date', () => {
        return request
            .post('/api/visits/create')
            .set('token', token)
            .send({
                "patientId": "chon",
                "visitDate": {"date": 29, "month": 2, "year": 2001}
            })
            .then(res => {
                expect(res.statusCode).toBe(400);
            })
    });

    test('getting visits of this patient', () => {
        return request
            .get('/api/visits?patientId=chon')
            .set('token', token)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(res.body.length).toBe(1);
            })
    });

    test('deleting visit for a patient', () => {
        return request
            .delete('/api/visits/delete')
            .set('token', token)
            .send({
                "patientId": "chon",
                "visitDate": {"date": 29, "month": 2, "year": 2000}
            })
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });
});