
exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_TEST_TYPES').del();
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('AVAILABLE_TEST_TYPES').insert([
    //   ]);
    // });
};
