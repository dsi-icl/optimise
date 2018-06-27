/*eslint no-unused-vars: "off"*/

const ceFields = require('../availableFields/availableFieldsForMS').ceFields;

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_CE').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_CE').insert(ceFields);
        });
};
