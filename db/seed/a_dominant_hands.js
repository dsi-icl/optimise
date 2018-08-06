exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('DOMINANT_HANDS').del()
        .then(function () {
            // Inserts seed entries
            return knex('DOMINANT_HANDS').insert([
                { value: 'left' },
                { value: 'right' },
                { value: 'ambidextrous' },
                { value: 'amputated' }
            ]);
        });
};
