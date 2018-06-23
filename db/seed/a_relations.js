/*eslint no-unused-vars: "off"*/

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('RELATIONS').del()
        .then(function () {
            // Inserts seed entries
            return knex('RELATIONS').insert([
                { value: 'self' },
                { value: 'mother' },
                { value: 'father' },
                { value: 'sisters' },
                { value: 'brothers' },
                { value: 'zygotic twins' },
                { value: 'maternal grandparent' },
                { value: 'maternal cousin' },
                { value: 'maternal aunt/uncle' },
                { value: 'paternal grandparent' },
                { value: 'paternal cousin' },
                { value: 'paternal aunt/uncle' }
            ]);
        });
};
