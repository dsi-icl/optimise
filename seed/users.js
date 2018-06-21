
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('USERS').del()
    .then(function () {
      // Inserts seed entries
      return knex('USERS').insert([
        {username:'admin', realName:'admin', pw:'a92e2c29eccc56ea49ed627a2656c4d5be74c29d80bd31709dd8b196a7f30825', adminPriv:1, createdByUser:1},
        {username:'pm', realName:'Pierre-Marie Danieau', pw:'4e9ad5555a1a33711c74a9be2e31b38d1eb02058259fdef60a5cfa0c3216f88d', adminPriv:0, createdByUser:1}
      ]);
    });
};
