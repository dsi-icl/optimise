const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const visitFields = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/visitFields.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_VISITS').del()
        .then(function () {
            // Inserts seed entries
            return knex.batchInsert('AVAILABLE_FIELDS_VISITS', visitFields, 50);
        });
};
