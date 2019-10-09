/* global beforeAll afterAll describe test expect */

import request from 'supertest';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
import { connectAdmin, connectUser, disconnectAgent } from './connection';

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Synchrionisation Controller tests', () => {
    test('Querying the current status', () => admin
        .get('/sync/status')
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            return true;
        }));
});