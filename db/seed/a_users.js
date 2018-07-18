const crypto = require('crypto');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    let saltAdmin = crypto.randomBytes(32).toString('base64');
    let iterationAdmin = Number.parseInt(crypto.randomBytes(2).toString('hex'), 16);
    let hashedAdmin = crypto.pbkdf2Sync('admin', saltAdmin, iterationAdmin, 64, 'sha512');
    hashedAdmin = hashedAdmin.toString('base64');
    let saltUser = crypto.randomBytes(32).toString('base64');
    let iterationUser = Number.parseInt(crypto.randomBytes(2).toString('hex'), 16);
    let hashedUser = crypto.pbkdf2Sync('admin', saltUser, iterationUser, 64, 'sha512');
    hashedUser = hashedUser.toString('base64');
    return knex('USERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('USERS').insert([
                { id: 1, username: 'admin', realName: 'Administrator', pw: hashedAdmin, salt: saltAdmin, iterations: iterationAdmin, adminPriv: 1, createdByUser: 1 }, //pw: 'admin'
                { id: 2, username: 'user', realName: 'Standard User', pw: hashedUser, salt: saltUser, iterations: iterationUser, adminPriv: 0, createdByUser: 1 }, //pw: 'admin'
            ]);
        });
};
