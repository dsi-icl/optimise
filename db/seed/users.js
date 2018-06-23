
exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('USERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('USERS').insert([
                { username: 'admin', realName: 'admin', pw: '$2b$12$8SfpVptBECQpcjMd/ZEACe1P6ngJfrFeBoersb8g3Payn9DzVtMaO', adminPriv: 1, createdByUser: 1 },
                { username: 'pm', realName: 'Pierre-Marie Danieau', pw: '4e9ad5555a1a33711c74a9be2e31b38d1eb02058259fdef60a5cfa0c3216f88d', adminPriv: 0, createdByUser: 1 }
            ]);
        });
};
