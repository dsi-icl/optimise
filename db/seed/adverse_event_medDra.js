const aeMedDRAList = require('../availableFields/availableLltMedDRA');

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('ADVERSE_EVENT_MEDDRA').del()
        .then(function() {
            // Inserts seed entries
            return knex.batchInsert('ADVERSE_EVENT_MEDDRA', aeMedDRAList, 500);
        });
};