/*eslint no-unused-vars: "off"*/
const countryList = require('../availableFields/availableCountriesAndEthnicities').countries;

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('COUNTRIES').del()
        .then(function () {
            // Inserts seed entries
            return knex('COUNTRIES').insert(countryList);
        });
};
