/*eslint no-unused-vars: "off"*/

const aeMedDRAList = require('../availableFields/availableLltMedDRA');

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('ADVERSE_EVENT_MEDDRA').del()
        .then(function () {
            // Inserts seed entries
            return knex('ADVERSE_EVENT_MEDDRA').insert(aeMedDRAList);
        });
};