const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const visitSections = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/visitSection.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_VISIT_SECTIONS').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_VISIT_SECTIONS').insert(visitSections)
        )
;
