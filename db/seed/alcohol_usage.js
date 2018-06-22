
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('ALCOHOL_USAGE').del()
        .then(function () {
            // Inserts seed entries
            return knex('ALCOHOL_USAGE').insert([
                { value: 'More than 3 units a day' },
                { value: 'Less than 3 units a day' },
                { value: 'Less than 3 units a week' },
                { value: 'No alcohol consumption' },
                { value: 'unknown' }
            ]);
        });
};
