const ethnicityList = require('../availableFields/availableCountriesAndEthnicities').ethnicities;

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('ETHNICITIES').del()
        .then(function () {
            // Inserts seed entries
            return knex('ETHNICITIES').insert(ethnicityList);
        });
};
