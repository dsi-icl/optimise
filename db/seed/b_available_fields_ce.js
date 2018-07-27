const { readJson } = require('../../src/utils/load-json');

const ceFields = readJson('./db/availableFields/jsonFiles/ceFields.json');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_CE').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_CE').insert(ceFields);
        });
};
