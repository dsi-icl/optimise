const conditionList = require('../availableFields/availableConditions');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('CONDITIONS').del()
        .then(function () {
            // Inserts seed entries
            return knex('CONDITIONS').insert(conditionList);
        });
};
