exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('ALCOHOL_USAGE').del()
        .then(() =>
            // Inserts seed entries
            knex('ALCOHOL_USAGE').insert([
                { value: 'More than 3 units a day' },
                { value: 'Less than 3 units a day' },
                { value: 'Less than 3 units a week' },
                { value: 'No alcohol consumption' },
                { value: 'Unknown' }
            ])
        )
;