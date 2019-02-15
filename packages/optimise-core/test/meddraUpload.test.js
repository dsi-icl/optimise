/* global beforeAll afterAll describe test expect */

const request = require('supertest');
const admin = request.agent(global.optimiseRouter);
const user = request.agent(global.optimiseRouter);
const { connectAdmin, disconnectAgent, connectUser } = require('./connection');


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

beforeAll(async () => {
    await connectAdmin(admin);
    await connectUser(user);
});

afterAll(async () => {
    await disconnectAgent(admin);
    await disconnectAgent(user);
});

describe('Meddra upload tests', () => {
    test('Initially the meddra code database is empty', () => admin
        .get('/meddra')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
            return true;
        })
    );

    test('user Uploading mdhier.asc', () => user
        .post('/uploadMeddra')
        .attach('mdhierfile', './test/seed/mdhier.asc')
        .then(res => {
            expect(res.statusCode).toBe(401);
            return true;
        })
    );

    test('admin Uploading mdhier.asc', () => admin
        .post('/uploadMeddra')
        .attach('mdhierfile', './test/seed/mdhier.asc')
        .then(res => {
            expect(res.statusCode).toBe(200);
            return true;
        })
    );

    test('meddra code database is filled', () => admin
        .get('/meddra')
        .then(res => {
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(8);
            expect(res.body).toEqual(meddraHierResult);
            return true;
        })
    );

});