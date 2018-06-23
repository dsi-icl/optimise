const availableFields = require('./availableFields/availableFieldsForMS');

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_VISITS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_VISITS').insert(availableFields.visitFields);
        });
};
