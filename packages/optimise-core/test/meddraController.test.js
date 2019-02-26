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
const meddraHierResult = [
    {
        'id': 1,
        'code': '10002042',
        'name': 'Anaemia deficiencies',
        'parent': 5,
        'isLeaf': 0,
        'deleted': '-'
    },
    {
        'id': 2,
        'code': '10002043',
        'name': 'Anaemia folate deficiency',
        'parent': 1,
        'isLeaf': 1,
        'deleted': '-'
    },
    {
        'id': 3,
        'code': '10002080',
        'name': 'Anaemia vitamin B12 deficiency',
        'parent': 1,
        'isLeaf': 1,
        'deleted': '-'
    },
    {
        'id': 4,
        'code': '10002081',
        'name': 'Anaemia vitamin B6 deficiency',
        'parent': 1,
        'isLeaf': 1,
        'deleted': '-'
    },
    {
        'id': 5,
        'code': '10002086',
        'name': 'Anaemias nonhaemolytic and marrow depression',
        'parent': 6,
        'isLeaf': 0,
        'deleted': '-'
    },
    {
        'id': 6,
        'code': '10005329',
        'name': 'Blood and lymphatic system disorders',
        'parent': null,
        'isLeaf': 0,
        'deleted': '-'
    },
    {
        'id': 7,
        'code': '10022972',
        'name': 'Iron deficiency anaemia',
        'parent': 1,
        'isLeaf': 1,
        'deleted': '-'
    },
    {
        'id': 8,
        'code': '10034695',
        'name': 'Pernicious anaemia',
        'parent': 1,
        'isLeaf': 1,
        'deleted': '-'
    }
];

describe('MedDRA upload tests', () => {
    test('Initially the MedDRA code database is empty', () => admin
        .get('/meddra')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.length).toBe(0);
            return true;
        })
    );

    test('user Uploading mdhier.asc', () => user
        .post('/uploadMeddra')
        .attach('mdhierfile', './test/seed/mdhier.asc')
        .then(({ statusCode }) => {
            expect(statusCode).toBe(401);
            return true;
        })
    );

    test('admin Uploading mdhier.asc', () => admin
        .post('/uploadMeddra')
        .attach('mdhierfile', './test/seed/mdhier.asc')
        .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
            return true;
        })
    );

    test('MedDRA code database is filled', () => admin
        .get('/meddra')
        .then(({ statusCode, body }) => {
            expect(statusCode).toBe(200);
            expect(body.length).toBe(8);
            expect(body).toEqual(meddraHierResult);
            return true;
        })
    );

    test('Updating MedDRA (upload again)', () => admin
        .post('/uploadMeddra')
        .attach('mdhierfile', './test/seed/mdhier.asc')
        .then(({ statusCode }) => {
            expect(statusCode).toBe(200);
            return true;
        })
    );

    test('MedDRA code database is updated', () => admin
        .get('/meddra')
        .then(({ statusCode, body }) => {
            const oldEntries = meddraHierResult.map(el => ({ ...el, deleted: '1' }));
            const newEntries = meddraHierResult.map(el => ({ ...el, id: el.id + 8, parent: el.parent && el.parent + 8 }));
            expect(statusCode).toBe(200);
            expect(body.length).toBe(16);
            expect(body).toEqual([...oldEntries, ...newEntries]);
            return true;
        })
    );

});

describe('Fetching MedDRA codes', () => {
    test('Search by name', () => admin
        .get('/meddra?search=nonhaemolytic')
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body).toBeDefined();
            expect(body).toHaveLength;
            expect(body.length).toBe(2);
            return true;
        }));

    test('Search by code', () => admin
        .get('/meddra?search=2086')
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body).toBeDefined();
            expect(body).toHaveLength;
            expect(body.length).toBe(2);
            return true;
        }));

    test('Get children from parent', () => admin
        .get('/meddra?parent=5')
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body).toBeDefined();
            expect(body).toHaveLength;
            expect(body.length).toBe(1);
            return true;
        }));

    test('Get children from non existing parent', () => admin
        .get('/meddra?parent=xoxox')
        .then(({ status, body }) => {
            expect(status).toBe(200);
            expect(typeof body).toBe('object');
            expect(body).toBeDefined();
            expect(body).toHaveLength;
            expect(body.length).toBe(0);
            return true;
        }));
});