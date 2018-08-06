exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('RELATIONS').del()
        .then(() =>
            // Inserts seed entries
            knex('RELATIONS').insert([
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
            ])
        )
;
