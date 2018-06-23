
exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('AVAILABLE_FIELDS_TESTS').del();
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('AVAILABLE_FIELDS_TESTS').insert([
    //   ]);
    // });
};
