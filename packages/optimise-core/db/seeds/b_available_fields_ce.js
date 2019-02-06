const ceFields = require('../availableFields/jsonFiles/ceFields.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_FIELDS_CE').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_FIELDS_CE').insert(ceFields)
        )
;
