const countryList = require('../availableFields/availableCountriesAndEthnicities').countries;

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('COUNTRIES').del()
        .then(function () {
            // Inserts seed entries
            return knex('COUNTRIES').insert(countryList);
        });
};
