const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const testFields = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/testFields.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_FIELDS_TESTS').del()
        .then(() =>
            // Inserts seed entries
            knex.batchInsert('AVAILABLE_FIELDS_TESTS', testFields, 50)
        );
