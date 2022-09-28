import request from 'supertest';
import message from '../src/utils/message-utils';
import { connectAdmin, connectUser, disconnectAgent } from './connection';

const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);

beforeAll(async () => { //eslint-disable-line no-undef
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => { //eslint-disable-line no-undef
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Testing data controller in various way', () => {
    test('Requesting a wrong data type', () => admin
        .post('/data/Wrong').then(({ status, body }) => {
            expect(status).toBe(404);
            expect(typeof body).toBe('object');
            expect(body.error).toBeDefined();
            expect(body.error).toBe(message.userError.WRONGPATH);
            return true;
        }));

});