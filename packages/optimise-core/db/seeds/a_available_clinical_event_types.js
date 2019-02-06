const availableCETypes = require('../availableFields/jsonFiles/ceTypes.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_CLINICAL_EVENT_TYPES').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_CLINICAL_EVENT_TYPES').insert(availableCETypes)
        )
;
