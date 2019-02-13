const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableCountries = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/countries.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('COUNTRIES').del()
        .then(() =>
            // Inserts seed entries
            knex('COUNTRIES').insert(availableCountries)
        )
;
