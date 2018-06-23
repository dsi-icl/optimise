
exports.seed = function(knex, ignore) {
    // Deletes ALL existing entries
    return knex('USER_SESSION').del()
        .then(function () {
            // Inserts seed entries
            return knex('USER_SESSION').insert([
                { user: 1, sessionToken: '69a87eeedcd5c90fea179a0c2464dff2f130a27a' }, //adminToken
                { user: 2, sessionToken: 'd844e282491350d2939efdbb8154cf801335af3b' }  //standardToken
            ]);
        });
};
