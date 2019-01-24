/* global describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const message = require('../src/utils/message-utils');

describe('User controller tests', () => {

    test('Testing rainbow with unicorn', () =>
        admin.get('/whoami')
            .then(res => {
                expect(res.statusCode).toBe(404);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(Object.keys(res.body).length).toBe(1);
                expect(res.body.error).toBe('An unknown unicorn');
                return true;
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
            expect(Object.keys(res.body).length).toBe(3);
            expect(res.body.status).toBeDefined();
            expect(res.body.status).toBe('OK');
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged in');
            return true;
        }));

    test('Testing connection with whoami', () =>
        admin.get('/whoami')
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
                expect(Object.keys(res.body).length).toBe(4);
                expect(res.body.id).toBe(1);
                expect(res.body.username).toBe('admin');
                expect(res.body.realname).toBe('Administrator');
                expect(res.body.priv).toBe(1);
                return true;
            }));

    test('Admin creating user (no 1) without admin priv with real name', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user', 'pw': 'test_pw', 'isAdmin': 0, 'realname': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(3);
            return true;
        }));

    test('Admin creating user (no 2) without admin priv without real name', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user2', 'pw': 'test_pw2', 'isAdmin': 0, 'realname': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(4);
            return true;
        }));

    test('Admin creating user (no 2) again', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user2', 'pw': 'test_pw2', 'isAdmin': 0, 'realname': 'IAmTesting' })
        .then(res => {
            expect(res.statusCode).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Admin get the users matching with "test" in their name', () =>
        admin.get('/users?username=test')
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBe(2);
                expect(res.body[0]).toHaveProperty('id');
                expect(res.body[0]).toHaveProperty('username');
                expect(res.body[0]).toHaveProperty('realname');
                expect(res.body[0]).toHaveProperty('priv');
                expect(res.body[0].username).toBe('test_user');
                expect(res.body[0].realname).toBe('IAmTesting');
                expect(res.body[0].priv).toBe(0);
                expect(res.body[1]).toHaveProperty('id');
                expect(res.body[1]).toHaveProperty('username');
                expect(res.body[1]).toHaveProperty('realname');
                expect(res.body[1]).toHaveProperty('priv');
                expect(res.body[1].username).toBe('test_user2');
                expect(res.body[1].realname).toBe('IAmTesting');
                expect(res.body[1].priv).toBe(0);
                return true;
            }));

    test('Admin user login out ()', () => admin
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged out');
            return true;
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
            expect(Object.keys(res.body).length).toBe(3);
            expect(res.body.status).toBeDefined();
            expect(res.body.status).toBe('OK');
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged in');
            return true;
        }));

    test('user no 1 tries to delete user no 2 (should fail)', () => user
        .delete('/users')
        .set('Content-type', 'application/json')
        .send({ 'username': 'test_user2' })
        .then(res => {
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
            return true;
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
                return true;
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
                return true;
            })
    );

    test('User no 1 gets users matching with "test" in their name', () =>
        user.get('/users?username=test')
            .then(res => {
                expect(res.statusCode).toBe(401);
                expect(res.body.error).toBeDefined();
                expect(res.body.error).toBe(message.userError.NORIGHTS);
                return true;
            }));

    test('User no 1 change rights of user no 2 (Should Fail)', () => user
        .patch('/users')
        .send({ id: 4, adminPriv: 1 })
        .then(res => {
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('User no 1 change their own rights (Should Fail)', () => user
        .patch('/users')
        .send({ id: 4, adminPriv: 1 })
        .then(res => {
            expect(res.statusCode).toBe(401);
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('User no 1 user login out ()', () =>
        user
            .post('/users/logout')
            .set('Content-type', 'application/json')
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe('Successfully logged out');
                return true;
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
                expect(Object.keys(res.body).length).toBe(3);
                expect(res.body.status).toBeDefined();
                expect(res.body.status).toBe('OK');
                expect(res.body.message).toBeDefined();
                expect(res.body.message).toBe('Successfully logged in');
                return true;
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
                return true;
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
            expect(Object.keys(res.body).length).toBe(3);
            expect(res.body.status).toBeDefined();
            expect(res.body.status).toBe('OK');
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged in');
            return true;
        }));

    test('admin change rights of user no 2 (MISSING ARGS on priv)', () => admin
        .patch('/users')
        .send({ id: 4, invalidArg: 1 })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));


    test('admin change rights of user no 2 (MISSING ARGS on id)', () => admin
        .patch('/users')
        .send({ user: 4, adminPriv: 1 })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('admin change rights of user no 2 (WRONG ARGS on priv)', () => admin
        .patch('/users')
        .send({ id: 4, adminPriv: {} })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('admin change rights of user no 2 (MISSING ARGS on priv)', () => admin
        .patch('/users')
        .send({ id: {}, adminPriv: 1 })
        .then(res => {
            expect(res.status).toBe(400);
            expect(typeof res.body).toBe('object');
            expect(res.body.error).toBeDefined();
            expect(res.body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('admin change rights of user no 2 (Success)', () => admin
        .patch('/users')
        .send({ id: 4, adminPriv: 1 })
        .then(res => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body.state).toBeDefined();
            expect(res.body.state).toBe(1);
            return true;
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
            return true;
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
            return true;
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
            return true;
        }));

    test('Admin user login out ()', () => admin
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBeDefined();
            expect(res.body.message).toBe('Successfully logged out');
            return true;
        }));
});
