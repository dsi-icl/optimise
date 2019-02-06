const availableTestTypes = require('../availableFields/jsonFiles/testTypes.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_TEST_TYPES').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_TEST_TYPES').insert(availableTestTypes)
        )
;
