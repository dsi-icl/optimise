const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const drugList = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/drugs.json`));

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_DRUGS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_DRUGS').insert(drugList);
        });
};
