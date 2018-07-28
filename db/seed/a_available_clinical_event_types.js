const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableCETypes = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/ceTypes.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_CLINICAL_EVENT_TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_CLINICAL_EVENT_TYPES').insert(availableCETypes);
        });
};
