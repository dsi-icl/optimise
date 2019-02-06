const visitFields = require('../availableFields/jsonFiles/visitFields.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_FIELDS_VISITS').del()
        .then(() =>
            // Inserts seed entries
            knex.batchInsert('AVAILABLE_FIELDS_VISITS', visitFields, 50)
        )
;
