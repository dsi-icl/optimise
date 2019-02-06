exports.seed = (knex) =>
    // Deletes ALL existing entries
    knex('REASONS').del()
        .then(() =>
            // Inserts seed entries
            knex('REASONS').insert([
                { id: 1, value: 'Patient preference', module: 'TREATMENTS' },
                { id: 2, value: 'Disease progresssion', module: 'TREATMENTS' },
                { id: 3, value: 'Death', module: 'TREATMENTS' },
                { id: 4, value: 'Permanent / Serious disability', module: 'TREATMENTS' },
                { id: 5, value: 'Prolonged hospitalization', module: 'TREATMENTS' },
                { id: 6, value: 'Pregnancy', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 7, value: 'Convenience', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 8, value: 'Adverse event', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 9, value: 'Unknown', module: 'TREATMENTS_INTERRUPTIONS' }
            ])
        )
;
