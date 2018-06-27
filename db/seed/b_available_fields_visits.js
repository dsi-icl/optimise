const visitFields = require('../availableFields/availableFieldsForMS').visitFields;

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_VISITS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_VISITS').insert(visitFields);
        });
};
