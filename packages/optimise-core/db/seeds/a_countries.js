const availableCountries = require('../availableFields/jsonFiles/countries.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('COUNTRIES').del()
        .then(() =>
            // Inserts seed entries
            knex('COUNTRIES').insert(availableCountries)
        )
;
