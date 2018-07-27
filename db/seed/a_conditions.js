const { readJson } = require('../../src/utils/load-json');

const availableConditions = readJson('./db/availableFields/jsonFiles/conditions.json');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('CONDITIONS').del()
        .then(function () {
            // Inserts seed entries
            return knex('CONDITIONS').insert(availableConditions);
        });
};
