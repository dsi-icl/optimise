const patientDemographic = require('../exampleData').patientDemographic;

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('PATIENT_DEMOGRAPHIC').del()
        .then(function () {
            // Inserts seed entries
            return knex('PATIENT_DEMOGRPHIC').insert(patientDemographic);
        });
};