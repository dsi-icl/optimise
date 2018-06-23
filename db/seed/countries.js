
exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('COUNTRIES').del();
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('COUNTRIES').insert([
    //   ]);
    // });
};
