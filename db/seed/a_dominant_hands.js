exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('DOMINANT_HANDS').del()
        .then(() =>
            // Inserts seed entries
            knex('DOMINANT_HANDS').insert([
                { value: 'left' },
                { value: 'right' },
                { value: 'ambidextrous' },
                { value: 'amputated' }
            ])
        )
;
