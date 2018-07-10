/*eslint no-unused-vars: "off"*/

const pregnancyOutcomeList = require('../availableFields/availablePregnancyOutcomes');

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('PREGNANCY_OUTCOMES').del()
        .then(function () {
            // Inserts seed entries
            return knex('PREGNANCY_OUTCOMES').insert(pregnancyOutcomeList);
        });
};