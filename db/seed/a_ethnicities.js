const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const availableEthnicities = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/ethnicities.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('ETHNICITIES').del()
        .then(() =>
            // Inserts seed entries
            knex('ETHNICITIES').insert(availableEthnicities)
        )
;
