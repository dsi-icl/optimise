
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('COUNTRIES').del();
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('COUNTRIES').insert([
    //   ]);
    // });
};
