
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('CONDITIONS').del();
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('CONDITIONS').insert([
    //   ]);
    // });
};
