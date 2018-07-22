const { readJson } = require('../../src/utils/load-json');

const visitFields = readJson('./db/availableFields/jsonFiles/visitFields.json');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_VISITS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_VISITS').insert(visitFields);
        });
};
