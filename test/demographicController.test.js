/* global describe test expect */

const app = require('../src/app');
const request = require('supertest')(app);
const tokens = require('./token');
const token = tokens.token;
const standardToken = tokens.standardToken;

// TO COMPLETE

describe('Create demographic data for patient.', () => {
    test('Create demogdata without body (FAIL)', () => request
        .post('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Create demogdata with bad body (FAIL)', () => request
        .post('/api/demogdata/Demographic')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Create demogdata with wrong body (FAIL)', () => {
        return request
            .post('/api/demogdata/Demographic')
            .set('token', token)
            .send({"patient":1, 
                    "DOB":{"day":1, "month":3, "year":1980},
                    "gender":"transgender",
                    "dominantHand":"right",
                    "ethnicity":"White",
                    "countryOfOrigin":"France",
                    "alcoholUsage":"More than 3 units a day",
                    "smokingHistory":"ex-smoker"})
            .then(res => {
                expect(res.statusCode).toBe(400);
            })
    });

    // TODO
    test('Create demogdata with good body (SUCCESS)', () => {
        return request
            .post('/api/demogdata/Demographic')
            .set('token', token)
            .send({"patient":1, 
                "DOB":{"day":1, "month":3, "year":1980},
                "gender":"male",
                "dominantHand":"right",
                "ethnicity":"White",
                "countryOfOrigin":"France",
                "alcoholUsage":"More than 3 units a day",
                "smokingHistory":"ex-smoker"})
            .then(res => {
                expect(res.statusCode).toBe(400);
            })
    });
});

describe('Edit demographic data for patient.', () => {
    test('Edit demogdata without body (FAIL)', () => request
        .put('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Edit demogdata with bad body (FAIL)', () => request
        .put('/api/demogdata/Demographic')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Edit demogdata with wrong body (FAIL)', () => request
        .put('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Edit demogdata with good body (SUCCESS)', () => request
        .put('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Get demographic data for patient.', () => {
    test('Get demogdata without body (FAIL)', () => request
        .get('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Get demogdata with bad body (FAIL)', () => request
        .get('/api/demogdata/Demographic')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Get demogdata with wrong body (FAIL)', () => request
        .get('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Get demogdata with good body (SUCCESS)', () => request
        .get('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Delete demographic data for patient.', () => {
    test('Delete demogdata without body (FAIL)', () => request
        .delete('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Delete demogdata with bad body (FAIL)', () => request
        .delete('/api/demogdata/Demographic')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Delete demogdata with wrong body (FAIL)', () => request
        .delete('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Delete demogdata with good body (SUCCESS)', () => request
        .delete('/api/demogdata/Demographic')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Create immunisation data for patient.', () => {
    test('Create immudata without body (FAIL)', () => request
        .post('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Create immudata with bad body (FAIL)', () => request
        .post('/api/demogdata/Immunisation')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Create immudata with wrong body (FAIL)', () => request
        .post('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Create immudata with good body (SUCCESS)', () => request
        .post('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Edit Immunisation data for patient.', () => {
    test('Edit immudata without body (FAIL)', () => request
        .put('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Edit immudata with bad body (FAIL)', () => request
        .put('/api/demogdata/Immunisation')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Edit immudata with wrong body (FAIL)', () => request
        .put('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Edit immudata with good body (SUCCESS)', () => request
        .put('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Get Immunisation data for patient.', () => {
    test('Get immudata without body (FAIL)', () => request
        .get('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Get immudata with bad body (FAIL)', () => request
        .get('/api/demogdata/Immunisation')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Get immudata with wrong body (FAIL)', () => request
        .get('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Get immudata with good body (SUCCESS)', () => request
        .get('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Delete Immunisation data for patient.', () => {
    test('Delete immudata without body (FAIL)', () => request
        .delete('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Delete immudata with bad body (FAIL)', () => request
        .delete('/api/demogdata/Immunisation')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Delete immudata with wrong body (FAIL)', () => request
        .delete('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Delete immudata with good body (SUCCESS)', () => request
        .delete('/api/demogdata/Immunisation')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Create MedicalCondition data for patient.', () => {
    test('Create medcondata without body (FAIL)', () => request
        .post('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Create medcondata with bad body (FAIL)', () => request
        .post('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Create medcondata with wrong body (FAIL)', () => request
        .post('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Create medcondata with good body (SUCCESS)', () => request
        .post('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Edit MedicalCondition data for patient.', () => {
    test('Edit medcondata without body (FAIL)', () => request
        .put('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Edit medcondata with bad body (FAIL)', () => request
        .put('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Edit medcondata with wrong body (FAIL)', () => request
        .put('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Edit medcondata with good body (SUCCESS)', () => request
        .put('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Get MedicalCondition data for patient.', () => {
    test('Get medcondata without body (FAIL)', () => request
        .get('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Get medcondata with bad body (FAIL)', () => request
        .get('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Get medcondata with wrong body (FAIL)', () => request
        .get('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Get medcondata with good body (SUCCESS)', () => request
        .get('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});

describe('Delete MedicalCondition data for patient.', () => {
    test('Delete medcondata without body (FAIL)', () => request
        .delete('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    test('Delete medcondata with bad body (FAIL)', () => request
        .delete('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({
            'ERROR': 123,
            'WRONG': 'NOTGOOD'
        })
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Delete medcondata with wrong body (FAIL)', () => request
        .delete('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));

    // TODO
    test('Delete medcondata with good body (SUCCESS)', () => request
        .delete('/api/demogdata/MedicalCondition')
        .set('token', token)
        .send({})
        .then(res => {
            expect(res.statusCode).toBe(400);
        }));
});