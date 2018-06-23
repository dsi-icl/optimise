/*eslint no-unused-vars: "off"*/
const ethnicityList = require('./availableFields/availableCountriesAndEthnicities').ethnicities;

exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('ETHNICITIES').del()
        .then(function () {
            // Inserts seed entries
            return knex('ETHNICITIES').insert(ethnicityList);
        });
};
