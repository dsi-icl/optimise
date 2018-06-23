const patientData = require('../exampleData').patients;

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('PATIENTS').del()
        .then(function () {
            // Inserts seed entries
            return knex('PATIENTS').insert(patientData);
        });
};