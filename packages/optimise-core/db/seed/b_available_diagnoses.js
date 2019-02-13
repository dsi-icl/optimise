const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const diagnosesList = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/diagnoses.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_DIAGNOSES').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_DIAGNOSES').insert(diagnosesList)
        )
;
