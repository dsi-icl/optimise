const { readJson } = require('../../src/utils/load-json');

const availableCountries = readJson('./db/availableFields/jsonFiles/countries.json');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('COUNTRIES').del()
        .then(function () {
            // Inserts seed entries
            return knex('COUNTRIES').insert(availableCountries);
        });
};
