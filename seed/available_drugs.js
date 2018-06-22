
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('AVAILABLE_DRUGS').del();
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('AVAILABLE_DRUGS').insert([
    //   ]);
    // });
};
