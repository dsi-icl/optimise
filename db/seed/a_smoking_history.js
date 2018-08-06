exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('SMOKING_HISTORY').del()
        .then(() =>
            // Inserts seed entries
            knex('SMOKING_HISTORY').insert([
                { value: 'smoker' },
                { value: 'ex-smoker' },
                { value: 'never smoked' },
                { value: 'electronic cigarette' }
            ])
        )
;
