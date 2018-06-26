/*eslint no-unused-vars: "off"*/
const ceTypeList = require('../availableFields/availableTypesForMS').clinicalEvents;

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_CLINICAL_EVENT_TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_CLINICAL_EVENT_TYPES').insert(ceTypeList);
        });
};
