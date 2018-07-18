const { generateAndHash } = require('../../src/utils/generate-crypto');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    let hashedAdmin = generateAndHash('admin');
    let hashedUser = generateAndHash('admin');
    return knex('USERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('USERS').insert([
                { id: 1, username: 'admin', realName: 'Administrator', pw: hashedAdmin.hashed, salt: hashedAdmin.salt, iterations: hashedAdmin.iteration, adminPriv: 1, createdByUser: 1 }, //pw: 'admin'
                { id: 2, username: 'user', realName: 'Standard User', pw: hashedUser.hashed, salt: hashedUser.salt, iterations: hashedUser.iteration, adminPriv: 0, createdByUser: 1 }, //pw: 'admin'
            ]);
        });
};
