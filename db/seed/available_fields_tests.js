/*eslint no-unused-vars: "off"*/

const availableFields = require('./availableFields/availableFieldsForMS');

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_TESTS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_FIELDS_TESTS').insert(availableFields.testFields);
        });
};
