const { readJson } = require('../../src/utils/load-json');

const availableTestTypes = readJson('./db/availableFields/jsonFiles/testTypes.json');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_TEST_TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_TEST_TYPES').insert(availableTestTypes);
        });
};
