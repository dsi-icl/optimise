/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');

describe('User controller tests', () => {
    test('First user (admin) login', () => admin
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

    test('Testing connection with whoami', function () {
        admin.get('/whoami')
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
                expect(res.body.realname).toBe('Administrator');
                expect(res.body.priv).toBe(1);
            });
    });

    test('Admin creating user (no 1) without admin priv with real name', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user', 'pw': 'test_pw', 'isAdmin': 0, 'realname': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            // Not checking the value of res.body.state because it can change
        }));

    test('Admin creating user (no 2) without admin priv without real name', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user2', 'pw': 'test_pw2', 'isAdmin': 0, 'realname': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            // Not checking the value of res.body.state because it can change
        }));

    test('Admin get the users matching with "test" in their name', function () {
        admin.get('/users?username=test')
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(2);
                expect(res.body[0]).toHaveProperty('id');
                expect(res.body[0]).toHaveProperty('username');
                expect(res.body[0]).toHaveProperty('realname');
                expect(res.body[0].username).toBe('test_user');
                expect(res.body[0].realname).toBe('IAmTesting');
                expect(res.body[1]).toHaveProperty('id');
                expect(res.body[1]).toHaveProperty('username');
                expect(res.body[1]).toHaveProperty('realname');
                expect(res.body[1].username).toBe('test_user2');
                expect(res.body[1].realname).toBeDefined();
                expect(res.body[1].realname).toBe('IAmTesting');
            });
    });

    test('Admin user login out ()', () => admin
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged out');
        }));


    test('user no 1 (standard) login', () => user
        .post('/users/login')
        .set('Content-type', 'application/json')
        .send({
            username: 'test_user',
            pw: 'test_pw'
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

    test('user no 1 tries to delete user no 2 (should fail)', () => user
        .delete('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user2' })
        .then(res => {
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
        }));

    test('user no 1 changes user no 2 s password (should fail)', () =>   //
        user
            .put('/users')
            .set('Content-type', 'application/json')
            .send({ 'username': 'test_user2', 'pw': 'fake_password' })
            .then(res => {
                expect(res.statusCode).toBe(401);
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.NORIGHTS);
            })
    );

    test('user no 1 changes user no 1 s password', () =>   //
        user
            .put('/users')
            .set('Content-type', 'application/json')
            .send({ 'username': 'test_user', 'pw': 'new_password' })
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(1);
            })
    );

    test('User no 1 user login out ()', () =>
        user
            .post('/users/logout')
            .set('Content-type', 'application/json')
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe('Successfully logged out');
            }));

    test('user no 1 (standard) login again with new password', () =>
        user
            .post('/users/login')
            .set('Content-type', 'application/json')
            .send({
                username: 'test_user',
                pw: 'new_password'
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

    test('user no 1 deletes himself', () =>
        user
            .delete('/users')
            .set('Content-type', 'application/json')
            .send({ 'username': 'test_user' })
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(typeof res.body).toBe('object');
                expect(res.body.state).toBeDefined();
                expect(res.body.state).toBe(1);
            }));

    test('First user (admin) login', () => admin
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

    test('admin deletes user no 2', () => admin
        .delete('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user2' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Admin creating another user (no 1) without admin priv with real name again', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user', 'pw': 'test_pw', 'isAdmin': 0, 'realname': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            // Not checking the value of res.body.state because it can change
        }));

    test('admin deletes user no 1 again', () => admin
        .delete('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
        }));

    test('Admin user login out ()', () => admin
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged out');
        }));
});
