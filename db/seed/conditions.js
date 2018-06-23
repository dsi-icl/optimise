
exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('CONDITIONS').del();
    // .then(function () {
    //   // Inserts seed entries
    //   return knex('CONDITIONS').insert([
    //   ]);
    // });
};
