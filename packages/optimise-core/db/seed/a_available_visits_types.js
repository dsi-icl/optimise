const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableVisitTypes = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/visitTypes.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_VISIT_TYPES').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_VISIT_TYPES').insert(availableVisitTypes)
        )
;
