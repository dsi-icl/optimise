const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const pregnancyOutcomeList = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/pregnancyOutcomes.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('PREGNANCY_OUTCOMES').del()
        .then(() =>
            // Inserts seed entries
            knex('PREGNANCY_OUTCOMES').insert(pregnancyOutcomeList)
        )
;