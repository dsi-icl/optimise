const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableTestTypes = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/testTypes.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_TEST_TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_TEST_TYPES').insert(availableTestTypes);
        });
};
