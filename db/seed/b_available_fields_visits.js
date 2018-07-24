const availableVisitFields = require('../availableFields/availableFieldsForMS').visitFields;

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_VISITS').del()
        .then(function () {
            // Inserts seed entries
            return knex.batchInsert('AVAILABLE_FIELDS_VISITS', availableVisitFields, 50);
        });
};
