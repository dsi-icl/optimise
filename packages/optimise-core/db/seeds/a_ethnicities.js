const availableEthnicities = require('../availableFields/jsonFiles/ethnicities.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('ETHNICITIES').del()
        .then(() =>
            // Inserts seed entries
            knex('ETHNICITIES').insert(availableEthnicities)
        )
;
