const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const drugList = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/drugs.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('AVAILABLE_DRUGS').del()
        .then(() =>
            // Inserts seed entries
            knex('AVAILABLE_DRUGS').insert(drugList)
        )
;
