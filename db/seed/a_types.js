exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('TYPES').del()
        .then(() =>
            // Inserts seed entries
            knex('TYPES').insert([
                { id: 1, value: 'I' },
                { id: 2, value: 'F' },
                { id: 3, value: 'C' },
                { id: 4, value: 'T' },
                { id: 5, value: 'B' },
                { id: 6, value: 'D' },
                { id: 7, value: 'BLOB' }
            ])
        )
;