const path = require('path');
const { readJson } = require('../../src/utils/load-json');

const aeMedDRAList = readJson(path.normalize(`${path.dirname(__filename)}/../availableFields/jsonFiles/medra.json`));

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('ADVERSE_EVENT_MEDDRA').del()
        .then(() =>
            // Inserts seed entries
            knex.batchInsert('ADVERSE_EVENT_MEDDRA', aeMedDRAList, 100)
        )
;