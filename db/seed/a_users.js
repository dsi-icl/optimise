exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('USERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('USERS').insert([
                { id: 1, username: 'admin', realName: 'Administrator', pw: 'SjCEcWeEsbX9617QTe+Lo0oqONf6G3Zk5NX5K2rTHVXRuvz/zY3EQLMNbzAIONCoF0XXelh7SjDgb87RjY9rIA==', adminPriv: 1, createdByUser: 1 }, //pw: 'admin'
                { id: 2, username: 'user', realName: 'Standard User', pw: 'SjCEcWeEsbX9617QTe+Lo0oqONf6G3Zk5NX5K2rTHVXRuvz/zY3EQLMNbzAIONCoF0XXelh7SjDgb87RjY9rIA==', adminPriv: 0, createdByUser: 1 }, //pw: 'admin'
            ]);
        });
};
