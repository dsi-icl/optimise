/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);

let adminToken, standardToken;

describe('User controller tests', () => {
    test('First user (admin) login', () => request
        .post('/internalapi/userlogin')
        .set('Content-type', 'application/json')
        .send({
            username: 'admin',
            pw: 'admin'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(res.body).length).toBe(1);
            expect(res.body.token).toBeDefined();
            adminToken = res.body.token;
        }));

    test('Admin creating another user (no 1) without admin priv with real name', () => request
        .post('/api/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user', 'pw': 'test_pw', 'isAdmin': 0, 'realName': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));


    test('Admin user logging out another user (no 1) (should fail)', () => request
        .post('/internalapi/userlogout')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user' })
        .then(res => {
            expect(res.statusCode).toBe(401);
        }));


    test('Admin creating another user (no 2) without admin priv without real name', () => request
        .post('/api/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user2', 'pw': 'test_pw2', 'isAdmin': 0 })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('user no 1 (standard) login', () => request
        .post('/internalapi/userlogin')
        .set('Content-type', 'application/json')
        .send({
            username: 'test_user',
            pw: 'test_pw'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(res.body).length).toBe(1);
            expect(res.body.token).toBeDefined();
            standardToken = res.body.token;
        }));

    test('user no 1 tries to delete user no 2 (should fail)', () => request
        .delete('/api/users')
        .set('Content-type', 'application/json')
        .set('token', standardToken)
        .send({ 'username': 'test_user2' })
        .then(res => {
            expect(res.statusCode).toBe(401);
        }));

    test('user no 1 changes user no 2 s password (should fail)', () =>   //
        request
            .put('/api/users')
            .set('Content-type', 'application/json')
            .set('token', standardToken)
            .send({ 'username': 'test_user2', 'pw': 'fake_password' })
            .then(res => {
                expect(res.statusCode).toBe(401);
            })
    );

    test('user no 1 changes user no 1 s password', () =>   //
        request
            .put('/api/users')
            .set('Content-type', 'application/json')
            .set('token', standardToken)
            .send({ 'username': 'test_user', 'pw': 'new_password' })
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    );

    test('user no 1 (standard) login again', () => request
        .post('/internalapi/userlogin')
        .set('Content-type', 'application/json')
        .send({
            username: 'test_user',
            pw: 'new_password'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(res.body).length).toBe(1);
            expect(res.body.token).toBeDefined();
            standardToken = res.body.token;
        }));

    test('user no 1 deletes himself', () => request
        .delete('/api/users')
        .set('Content-type', 'application/json')
        .set('token', standardToken)
        .send({ 'username': 'test_user' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('admin deletes user no 2', () => request
        .delete('/api/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user2' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('Admin creating another user (no 1) without admin priv with real name again', () => request
        .post('/api/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user', 'pw': 'test_pw', 'isAdmin': 0, 'realName': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('admin deletes user no 1 again', () => request
        .delete('/api/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('admin logging out himself', () => request
        .post('/internalapi/userlogout')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'admin' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));
});
