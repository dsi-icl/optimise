exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('CONDITIONS').del()
        .then(function () {
            // Inserts seed entries
            return knex('CONDITIONS').insert([{ value: 'testing' }]);
        });
};
