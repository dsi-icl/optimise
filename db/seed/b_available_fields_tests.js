const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const testFields = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/testFields.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_TESTS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_TESTS').insert(testFields);
        });
};
