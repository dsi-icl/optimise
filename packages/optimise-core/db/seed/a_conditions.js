const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableConditions = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/conditions.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('CONDITIONS').del()
        .then(() =>
            // Inserts seed entries
            knex('CONDITIONS').insert(availableConditions)
        )
;
