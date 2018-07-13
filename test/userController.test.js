/* global describe test expect */

const request = require('supertest')(global.optimiseRouter);

let { adminToken, standardToken } = require('../test/token');

describe('User controller tests', () => {
    test('First user (admin) login', () => request
        .post('/users/login')
        .set('Content-type', 'application/json')
        .send({
            username: 'admin',
            pw: 'admin'
        })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(res.body).length).toBe(2);
            expect(res.body.status).toBeDefined();
            expect(res.body.status).toBe('OK');
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged in');
        }));

    test('Testing connected', function () {
        request.get('/whoami')
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(Object.keys(res.body).length).toBe(4);
                expect(res.body.id).toBeDefined();
                expect(res.body.username).toBeDefined();
                expect(res.body.realname).toBeDefined();
                expect(res.body.priv).toBeDefined();
                expect(res.body.id).toBe(1);
                expect(res.body.username).toBe('admin');
                expect(res.body.realname).toBe('admin');
                expect(res.body.priv).toBeDefined(1);
            });
    });

    test('Admin creating another user (no 1) without admin priv with real name', () => request
        .post('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user', 'pw': 'test_pw', 'isAdmin': 0, 'realName': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(typeof res.body[0]).toBe('number');
        }));

    test('Admin user login out ()', () => request
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged out');
        }));


    test('Admin creating another user (no 2) without admin priv without real name', () => request
        .post('/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user2', 'pw': 'test_pw2', 'isAdmin': 0 })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('user no 1 (standard) login', () => request
        .post('/users/login')
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
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('token', standardToken)
        .send({ 'username': 'test_user2' })
        .then(res => {
            expect(res.statusCode).toBe(401);
        }));

    test('user no 1 changes user no 2 s password (should fail)', () =>   //
        request
            .put('/users')
            .set('Content-type', 'application/json')
            .set('token', standardToken)
            .send({ 'username': 'test_user2', 'pw': 'fake_password' })
            .then(res => {
                expect(res.statusCode).toBe(401);
            })
    );

    test('user no 1 changes user no 1 s password', () =>   //
        request
            .put('/users')
            .set('Content-type', 'application/json')
            .set('token', standardToken)
            .send({ 'username': 'test_user', 'pw': 'new_password' })
            .then(res => {
                expect(res.statusCode).toBe(200);
            })
    );

    test('user no 1 (standard) login again', () => request
        .post('/users/login')
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
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('token', standardToken)
        .send({ 'username': 'test_user' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('admin deletes user no 2', () => request
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user2' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('Admin creating another user (no 1) without admin priv with real name again', () => request
        .post('/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user', 'pw': 'test_pw', 'isAdmin': 0, 'realName': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('admin deletes user no 1 again', () => request
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'test_user' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));

    test('admin logging out himself', () => request
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .set('token', adminToken)
        .send({ 'username': 'admin' })
        .then(res => {
            expect(res.statusCode).toBe(200);
        }));
});
