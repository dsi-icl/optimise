const pregnancyOutcomeList = require('../availableFields/jsonFiles/pregnancyOutcomes.json');

exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('PREGNANCY_OUTCOMES').del()
        .then(() =>
            // Inserts seed entries
            knex('PREGNANCY_OUTCOMES').insert(pregnancyOutcomeList)
        )
;