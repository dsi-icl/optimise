const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const ceFields = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/ceFields.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_FIELDS_CE').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_FIELDS_CE').insert(ceFields)
        )
;
