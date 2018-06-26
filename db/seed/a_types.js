/*eslint no-unused-vars: "off"*/

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('TYPES').del()
        .then(function () {
            // Inserts seed entries
            return knex('TYPES').insert([
                { id: 1, value: 'I' },
                { id: 2, value: 'F' },
                { id: 3, value: 'C' },
                { id: 4, value: 'T' },
                { id: 5, value: 'B' },
                { id: 6, value: 'BLOB' }
            ]);
        });
};