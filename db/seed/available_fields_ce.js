/*eslint no-unused-vars: "off"*/

const availableFields = require('./availableFields/availableFieldsForMS');

exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_CE').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_CE').insert(availableFields.clinicalEvents);
        });
};
