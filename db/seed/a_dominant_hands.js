/*eslint no-unused-vars: "off"*/

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('DOMINANT_HANDS').del()
        .then(function () {
            // Inserts seed entries
            return knex('DOMINANT_HANDS').insert([
                { value: 'left' },
                { value: 'right' },
                { value: 'ambidextrous' },
                { value: 'amputed' },
                { value: 'unknown' }
            ]);
        });
};
