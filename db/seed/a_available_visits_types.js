const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableVisitTypes = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/visitTypes.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_VISIT_TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_VISIT_TYPES').insert(availableVisitTypes);
        });
};
