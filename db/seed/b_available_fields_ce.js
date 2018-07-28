const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const ceFields = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/ceFields.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_CE').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_CE').insert(ceFields);
        });
};
