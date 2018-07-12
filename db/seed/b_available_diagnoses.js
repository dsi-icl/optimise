const diagnosesList = require('../availableFields/availableDiagnoses');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_DIAGNOSES').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_DIAGNOSES').insert(diagnosesList);
        });
};
