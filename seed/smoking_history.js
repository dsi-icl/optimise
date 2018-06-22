
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('SMOKING_HISTORY').del()
        .then(function () {
            // Inserts seed entries
            return knex('SMOKING_HISTORY').insert([
                { value:'smoker' },
                { value:'ex-smoker' },
                { value:'never smoked' },
                { value:'electronic cigarette' },
                { value:'unknown' }
            ]);
        });
};
