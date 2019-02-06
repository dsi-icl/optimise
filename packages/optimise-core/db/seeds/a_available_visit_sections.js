const visitSections = require('../availableFields/jsonFiles/visitSection.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_VISIT_SECTIONS').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_VISIT_SECTIONS').insert(visitSections)
        )
;
