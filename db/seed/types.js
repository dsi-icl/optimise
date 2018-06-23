
exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('TYPES').insert([
                { value: 'I' },
                { value: 'F' },
                { value: 'C' },
                { value: 'T' },
                { value: 'B' }
            ]);
        });
};
