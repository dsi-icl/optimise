const app = require('../src/app');
const request = require('supertest')(app);

const PatientController = require('../src/controllers/patientController');


let token;

describe('User controller tests', () => {
    test('User login', () => {
        return request
            .post('/internalapi/userlogin')
            .set('Content-type', 'application/json')
            .send({
                username: "flor",
                pw: "heyhey"
                })
            .then(res => {
                console.log(res);
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(Object.keys(res.body).length).toBe(1);
                expect(res.body.token).toBeDefined();
                token = res.body.token;
            })
    });

    test('User logging out another user (should fail)', () => {
        return request
            .post('/internalapi/userlogout')
            .set('Content-type', 'application/json')
            .set('token', token)
            .send({'username': 'chon'})
            .then(res => {
                expect(res.statusCode).toBe(401);
            })
    });
    
    test('User logging out himself', () => {
        return request
            .post('/internalapi/userlogout')
            .set('Content-type', 'application/json')
            .set('token', token)
            .send({'username': 'flor'})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });



});
