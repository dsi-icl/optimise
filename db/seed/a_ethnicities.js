const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableEthnicities = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/ethnicities.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('ETHNICITIES').del()
        .then(function () {
            // Inserts seed entries
            return knex('ETHNICITIES').insert(availableEthnicities);
        });
};
