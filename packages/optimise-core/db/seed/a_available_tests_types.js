const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableTestTypes = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/testTypes.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_TEST_TYPES').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_TEST_TYPES').insert(availableTestTypes)
        )
;
