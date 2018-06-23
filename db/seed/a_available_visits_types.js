/*eslint no-unused-vars: "off"*/

const visits = require('../availableFields/availableTypesForMS').visits;

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_VISIT_TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_VISIT_TYPES').insert(visits);
        });
};
