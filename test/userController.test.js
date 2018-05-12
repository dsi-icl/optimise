const app = require('../src/app');
const request = require('supertest')(app);

const PatientController = require('../src/controllers/patientController');


let adminToken, standardToken;

describe('User controller tests', () => {
    test('First user (admin) login', () => {
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
                adminToken = res.body.token;
            })
    });

    test('Admin user logging out another user (should fail)', () => {
        return request
            .post('/internalapi/userlogout')
            .set('Content-type', 'application/json')
            .set('token', adminToken)
            .send({'username': 'chon'})
            .then(res => {
                expect(res.statusCode).toBe(401);
            })
    });

    test('Admin creating another user (no 1) without admin priv with real name', () => {
        return request
            .post('/api/users/create')
            .set('Content-type', 'application/json')
            .set('token', adminToken)
            .send({"username": "test_user", "pw": "test_pw", "isAdmin": 0, "realName": "IAmTesting"})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });
    
    test('Admin creating another user (no 2) without admin priv without real name', () => {
        return request
            .post('/api/users/create')
            .set('Content-type', 'application/json')
            .set('token', adminToken)
            .send({"username": "test_user2", "pw": "test_pw2", "isAdmin": 0})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });

    test('First user (admin) login', () => {
        return request
            .post('/internalapi/userlogin')
            .set('Content-type', 'application/json')
            .send({
                username: "test_user2",
                pw: "test_pw2"
                })
            .then(res => {
                console.log(res);
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(Object.keys(res.body).length).toBe(1);
                expect(res.body.token).toBeDefined();
                adminToken = res.body.token;
            })
    });

    test('Delete user no 1', () => {
        return request
            .delete('/api/users/delete')
            .set('Content-type', 'application/json')
            .set('token', adminToken)
            .send({"username": "test_user"})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });

    test('Delete user no 2', () => {
        return request
            .delete('/api/users/delete')
            .set('Content-type', 'application/json')
            .set('token', adminToken)
            .send({"username": "test_user2"})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });

    test('User logging out himself', () => {
        return request
            .post('/internalapi/userlogout')
            .set('Content-type', 'application/json')
            .set('token', adminToken)
            .send({'username': 'flor'})
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    });



});
