const availableConditions = require('../availableFields/jsonFiles/conditions.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('CONDITIONS').del()
        .then(() =>
            // Inserts seed entries
            knex('CONDITIONS').insert(availableConditions)
        )
;
