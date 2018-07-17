exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('USERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('USERS').insert([
                { id: 1, username: 'admin', realName: 'Administrator', pw: '4a3084716784b1b5fdeb5ed04def8ba34a2a38d7fa1b7664e4d5f92b6ad31d55d1bafcffcd8dc440b30d6f300838d0a81745d77a587b4a30e06fced18d8f6b20', adminPriv: 1, createdByUser: 1 }, //pw: 'admin'
                { id: 2, username: 'user', realName: 'Standard User', pw: '4a3084716784b1b5fdeb5ed04def8ba34a2a38d7fa1b7664e4d5f92b6ad31d55d1bafcffcd8dc440b30d6f300838d0a81745d77a587b4a30e06fced18d8f6b20', adminPriv: 0, createdByUser: 1 }, //pw: 'admin'
            ]);
        });
};
