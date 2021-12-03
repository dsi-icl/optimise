/* global beforeAll afterAll describe test expect */

import request from 'supertest';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
import message from '../src/utils/message-utils';
import { connectAdmin, connectUser, disconnectAgent } from './connection';

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Create concomitant med controller test', () => {
    test('Creating concomitant med without body', () => admin
        .post('/concomitantMeds')
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating concomitant med with body but empty property (Should Fail)', () => admin
        .post('/concomitantMeds')
        .send({
            visitId: null,
            concomitantMedId: null,
            indication: null,
            startDate: null,
            endDate: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Creating concomitant med with body but badly formated property (Should Fail)', () => admin
        .post('/concomitantMeds')
        .send({
            visitId: 1,
            concomitantMedId: 2,
            indication: 'just testing',
            startDate: 'fsdaf',
            endDate: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Creating concomitant med with body but visit does not exist (Should Fail)', () => admin
        .post('/concomitantMeds')
        .send({
            visitId: 123456789,
            concomitantMedId: 2,
            indication: 'just testing',
            startDate: 124325,
            endDate: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe('Couldn\'t create entry');
            expect(body.stack.stack.error.indexOf('FOREIGN KEY constraint failed')).not.toBe(-1);
            return true;
        }));

    test('Creating concomitant med with out endDate', () => admin
        .post('/concomitantMeds')
        .send({
            visitId: 1,
            concomitantMedId: 2,
            indication: 'just testing',
            startDate: 12432534,
            endDate: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.error).toBeUndefined();
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Creating the same drug for the same visit (should pass)', () => admin
        .post('/concomitantMeds')
        .send({
            visitId: 1,
            concomitantMedId: 2,
            indication: 'just testing',
            startDate: 12432534,
            endDate: 13428904
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.error).toBeUndefined();
            expect(body.state).toBeDefined();
            expect(body.state).toBe(2);
            return true;
        }));

    test('Creating concomitant med with endDate', () => admin
        .post('/concomitantMeds')
        .send({
            visitId: 1,
            concomitantMedId: 5,
            indication: 'just testing',
            startDate: 12432534,
            endDate: 13428904
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.error).toBeUndefined();
            expect(body.state).toBeDefined();
            expect(body.state).toBe(3);
            return true;
        }));
});

describe('Edit concomitant med controller test', () => {
    test('Editing concomitant med without body', () => admin
        .put('/concomitant')
        .then(({ status }) => {
            expect(status).toBe(400);
            return true;
        }));

    test('Editing concomitant med with missing argument (should fail)', () => admin
        .put('/concomitantMeds')
        .send({
            // concomitantMedEntryId: 1,
            indication: 'justforfun',
            startDate: 123442314,
            endDate: null
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.MISSINGARGUMENT);
            return true;
        }));

    test('Editing concomitant med with malformed argument (should fail)', () => admin
        .put('/concomitantMeds')
        .send({
            concomitantMedEntryId: 1,
            startDate: '123442314',
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('Editing a non-existing concomitant med entry (should fail)', () => admin
        .put('/concomitantMeds')
        .send({
            concomitantMedEntryId: 5,
            endDate: 123442314
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe('Couldn\'t update entry');
            expect(body.stack.stack).toBe('Couldn\'t find the entry');
            return true;
        }));

    test('Editing concomitant med with extra unnecessary arguments', () => admin
        .put('/concomitantMeds')
        .send({
            concomitantMedEntryId: 1,
            endDate: 123442314,
            fakeargument: 123442314
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.error).toBeUndefined();
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));

    test('Editing concomitant med', () => admin
        .put('/concomitantMeds')
        .send({
            concomitantMedEntryId: 2,
            endDate: 123442314
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.error).toBeUndefined();
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));
});

describe('Delete concomitant med controller test', () => {
    test('delete concomitant med with wrong type argument (should fail)', () => admin
        .put('/concomitantMeds')
        .send({
            concomitantMedEntryId: '1'
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGARGUMENTS);
            return true;
        }));

    test('delete an non-existing concomitant med', () => admin
        .put('/concomitantMeds')
        .send({
            concomitantMedEntryId: 2921050912
        })
        .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe('Couldn\'t update entry');
            expect(body.stack.stack).toBe('Couldn\'t find the entry');
            return true;
        }));

    test('delete concomitant med', () => admin
        .put('/concomitantMeds')
        .send({
            concomitantMedEntryId: 1
        })
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body.error).toBeUndefined();
            expect(body.state).toBeDefined();
            expect(body.state).toBe(1);
            return true;
        }));
});