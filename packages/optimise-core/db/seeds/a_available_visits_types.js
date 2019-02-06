const availableVisitTypes = require('../availableFields/jsonFiles/visitTypes.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_VISIT_TYPES').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_VISIT_TYPES').insert(availableVisitTypes)
        )
;
