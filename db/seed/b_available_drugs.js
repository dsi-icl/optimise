const drugList = require('../availableFields/availableDrugsForMS');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_DRUGS').del()
        .then(function () {
            // Inserts seed entries
            return knex('AVAILABLE_DRUGS').insert(drugList);
        });
};
