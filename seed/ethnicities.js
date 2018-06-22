
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('ETHNICITIES').del()
        .then(function () {
            // Inserts seed entries
            return knex('ETHNICITIES').insert([
                { value: 'White' },
                { value: 'Asian' },
                { value: 'Black' },
                { value: 'Mixed/Multiple ethnic groups' },
                { value: 'Other ethnic group' },
                { value: 'Unknown' }
            ]);
        });
};
