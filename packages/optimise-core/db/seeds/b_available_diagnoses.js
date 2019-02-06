const diagnosesList = require('../availableFields/jsonFiles/diagnoses.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_DIAGNOSES').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_DIAGNOSES').insert(diagnosesList)
        )
;
