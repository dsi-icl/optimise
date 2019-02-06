const drugList = require('../availableFields/jsonFiles/drugs.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_DRUGS').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_DRUGS').insert(drugList)
        )
;
