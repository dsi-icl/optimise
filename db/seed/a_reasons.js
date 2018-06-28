exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('REASONS').del()
        .then(function () {
            // Inserts seed entries
            return knex('REASONS').insert([
                { id: 1, value: 'patient preference', module: 'TREATMENTS' },
                { id: 2, value: 'disease progresssion', module: 'TREATMENTS' },
                { id: 3, value: 'death', module: 'TREATMENTS' },
                { id: 4, value: 'life threatening reaction to drug', module: 'TREATMENTS' },
                { id: 5, value: 'permanent / serious disability', module: 'TREATMENTS' },
                { id: 6, value: 'prolonged hospitalization', module: 'TREATMENTS' },
                { id: 7, value: 'pregnancy', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 8, value: 'convenience', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 9, value: 'adverse event', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 10, value: 'unknown', module: 'TREATMENTS_INTERRUPTIONS' }
            ]);
        });
};
