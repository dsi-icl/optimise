const { readJson } = require('../../src/utils/load-json');

const visitSections = readJson('./db/availableFields/jsonFiles/visitSection.json');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_VISIT_SECTIONS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_VISIT_SECTIONS').insert(visitSections);
        });
};
