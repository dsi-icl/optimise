const visitSections = require('../availableFields/availableSectionsForVisits');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_VISIT_SECTIONS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_VISIT_SECTIONS').insert(visitSections);
        });
};
