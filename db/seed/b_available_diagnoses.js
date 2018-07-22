const { readJson } = require('../../src/utils/load-json');

const diagnosesList = readJson('./db/availableFields/jsonFiles/diagnoses.json');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_DIAGNOSES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_DIAGNOSES').insert(diagnosesList);
        });
};
