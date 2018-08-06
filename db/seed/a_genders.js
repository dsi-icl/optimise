exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('GENDERS').del()
        .then(() =>
            // Inserts seed entries
            knex('GENDERS').insert([
                { value: 'male' },
                { value: 'female' },
                { value: 'other' },
                { value: 'prefer not to say' }
            ])
        )
;
