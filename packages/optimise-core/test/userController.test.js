import request from 'supertest';
import message from '../src/utils/message-utils';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);

let csrfToken;

describe('User controller tests', () => {

    test('Testing rainbow with unicorn', () => admin
        .get('/whoami')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(404);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(headers['csrf-token']).toBeUndefined();
            expect(Object.keys(body).length).toBe(1);
            expect(body.error).toBe('An unknown unicorn');
            return true;
        }));

    test('First user (admin) login', () => admin
        .post('/users/login')
        .set('Content-type', 'application/json')
        .send({
            username: 'admin',
            pw: 'admin'
        })
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(body).length).toBe(3);
            expect(body.status).toBeDefined();
            expect(body.status).toBe('OK');
            expect(body.message).toBeDefined();
            expect(body.message).toBe('Successfully logged in');
            return true;
        }));

    test('Testing connection with whoami', () => admin
        .get('/whoami')
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(headers['csrf-token']).toBeDefined();
            expect(Object.keys(body).length).toBe(6);
            expect(body.id).toBe(1);
            expect(body.username).toBe('admin');
            expect(body.realname).toBe('Administrator');
            expect(body.adminPriv).toBe(1);
            csrfToken = headers['csrf-token'];
            return true;
        }));

    test('Admin creating user (no 1) without admin priv with real name', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user', pw: 'test_pw', isAdmin: 0, email: 'test_user@test.com', realname: 'IAmTesting' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(3);
            return true;
        }));

    test('Admin creating user (no 2) without admin priv without real name', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2', pw: 'test_pw2', isAdmin: 0 })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Admin creating user (no 2) without admin priv without email', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2', pw: 'test_pw2', isAdmin: 0, realname: 'IAmTesting' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Admin creating user (no 2) with invalid email', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2', pw: 'test_pw2', isAdmin: 0, email: 'test_.test.com', realname: 'IAmTesting2' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Admin creating user (no 2) with valid data', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2', pw: 'test_pw2', isAdmin: 0, email: 'test_user2@test.com', realname: 'IAmTesting2' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(4);
            return true;
        }));

    test('Admin creating user (no 2) again', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2', pw: 'test_pw2', isAdmin: 0, email: 'test_user2@test.com', realname: 'IAmTesting2' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.errorMessages.CREATIONFAIL);
            return true;
        }));

    test('Admin get the users matching with "test" in their name', () => admin
        .get('/users?username=test')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBe(2);
            expect(body[0]).toHaveProperty('id');
            expect(body[0]).toHaveProperty('username');
            expect(body[0]).toHaveProperty('realname');
            expect(body[0]).toHaveProperty('adminPriv');
            expect(body[0].username).toBe('test_user');
            expect(body[0].realname).toBe('IAmTesting');
            expect(body[0].adminPriv).toBe(0);
            expect(body[1]).toHaveProperty('id');
            expect(body[1]).toHaveProperty('username');
            expect(body[1]).toHaveProperty('realname');
            expect(body[1]).toHaveProperty('adminPriv');
            expect(body[1].username).toBe('test_user2');
            expect(body[1].realname).toBe('IAmTesting2');
            expect(body[1].adminPriv).toBe(0);
            return true;
        }));

    test('Admin user login out ()', () => admin
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.message).toBeDefined();
            expect(body.message).toBe('Successfully logged out');
            return true;
        }));


    test('User no 1 (standard) login', () => user
        .post('/users/login')
        .set('Content-type', 'application/json')
        .send({
            username: 'test_user',
            pw: 'test_pw'
        })
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(body).length).toBe(3);
            expect(body.status).toBeDefined();
            expect(body.status).toBe('OK');
            expect(body.message).toBeDefined();
            expect(body.message).toBe('Successfully logged in');
            return user.get('/whoami')
                .then(({ headers }) => {
                    csrfToken = headers['csrf-token'];
                    return true;
                });
        }));

    test('User no 1 tries to delete user no 2 (should fail)', () => user
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(401);
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('User no 1 changes user no 2 s password (should fail)', () => user
        .put('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2', pw: 'fake_password' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(401);
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.NORIGHTS);
            return true;
        })
    );

    test('User no 1 changes user no 1 s password', () => user
        .put('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user', pw: 'new_password' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        })
    );

    test('User no 1 gets users matching with "test" in their name', () => user
        .get('/users?username=test')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(401);
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('User no 1 change rights of user no 2 (Should Fail)', () => user
        .patch('/users')
        .set('CSRF-Token', csrfToken)
        .send({ id: 4, adminPriv: 1 })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(401);
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('User no 1 change their own rights (Should Fail)', () => user
        .patch('/users')
        .set('CSRF-Token', csrfToken)
        .send({ id: 4, adminPriv: 1 })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(401);
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.NORIGHTS);
            return true;
        }));

    test('User no 1 user login out ()', () => user
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.message).toBeDefined();
            expect(body.message).toBe('Successfully logged out');
            return true;
        }));

    test('User no 1 (standard) login again with new password', () => user
        .post('/users/login')
        .set('Content-type', 'application/json')
        .send({
            username: 'test_user',
            pw: 'new_password'
        })
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(body).length).toBe(3);
            expect(body.status).toBeDefined();
            expect(body.status).toBe('OK');
            expect(body.message).toBeDefined();
            expect(body.message).toBe('Successfully logged in');
            return user.get('/whoami')
                .then(({ headers }) => {
                    csrfToken = headers['csrf-token'];
                    return true;
                });
        }));

    test('User no 1 deletes himself', () => user
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('First user (admin) login', () => admin
        .post('/users/login')
        .set('Content-type', 'application/json')
        .send({
            username: 'admin',
            pw: 'admin'
        })
        .then(({ statusCode, headers, body }) => {
            expect(statusCode).toBe(200);
            expect(headers['content-type']).toBe('application/json; charset=utf-8');
            expect(Object.keys(body).length).toBe(3);
            expect(body.status).toBeDefined();
            expect(body.status).toBe('OK');
            expect(body.message).toBeDefined();
            expect(body.message).toBe('Successfully logged in');
            return admin.get('/whoami')
                .then(({ headers }) => {
                    csrfToken = headers['csrf-token'];
                    return true;
                });
        }));

    test('Admin changes rights of user no 2 (MISSING ARGS on priv)', () => admin
        .patch('/users')
        .set('CSRF-Token', csrfToken)
        .send({ id: 4, invalidArg: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));


    test('Admin changes rights of user no 2 (MISSING ARGS on id)', () => admin
        .patch('/users')
        .set('CSRF-Token', csrfToken)
        .send({ user: 4, adminPriv: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Admin changes rights of user no 2 (WRONG ARGS on priv)', () => admin
        .patch('/users')
        .set('CSRF-Token', csrfToken)
        .send({ id: 4, adminPriv: {} })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Admin changes rights of user no 2 (MISSING ARGS on priv)', () => admin
        .patch('/users')
        .set('CSRF-Token', csrfToken)
        .send({ id: {}, adminPriv: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Admin changes rights of user no 2 (Success)', () => admin
        .patch('/users')
        .set('CSRF-Token', csrfToken)
        .send({ id: 4, adminPriv: 1 })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Admin deletes user no 2', () => admin
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user2' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Admin creating another user (no 1) without admin priv with real name again', () => admin
        .post('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user', pw: 'test_pw', isAdmin: 0, email: 'test_user@test.com', realname: 'IAmTesting' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            // Not checking the value of res.body.state because it can change
            return true;
        }));

    test('Admin deletes user no 1 again', () => admin
        .delete('/users')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .send({ username: 'test_user' })
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Admin user login out ()', () => admin
        .post('/users/logout')
        .set('Content-type', 'application/json')
        .set('CSRF-Token', csrfToken)
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.message).toBeDefined();
            expect(body.message).toBe('Successfully logged out');
            return true;
        }));
});
