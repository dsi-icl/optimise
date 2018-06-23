/*eslint no-unused-vars: "off"*/

exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('USERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('USERS').insert([
                { id: 1, username: 'admin', realName: 'admin', pw: '$2b$12$ueFHSJyMtbZDY2WWKBApoOeUcpUR4Z2YQSU4BismxMBnvIEQfS.Hu', adminPriv: 1, createdByUser: 1 }, //pw: 'admin'
                { id: 2, username: 'pm', realName: 'Pierre-Marie Danieau', pw: '$2b$12$ueFHSJyMtbZDY2WWKBApoOeUcpUR4Z2YQSU4BismxMBnvIEQfS.Hu', adminPriv: 0, createdByUser: 1 }  //pw: 'admin'
            ]);
        });
};
