exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('USERS').del()
        .then(function () {
            // Inserts seed entries
            return knex('USERS').insert([
                { id: 1, username: 'admin', realName: 'Administrator', pw: 'ZTBfTmM80TDowVs5ymCD/KfSrMeaz9bYt2cB9lIdyw763z5qgYqgsbGzsY9XNocw7qppmFRaBGooxmgSPCM7Ug==', salt: '1OJ3YQeOU4UOAftW7VugpxLyjoJEChmHV2wCxlh7qN2WL40hsAyA27MEKD9yCKsUyX0INWVtxxBYEvIw4Gr11b71QIdOYTSRqWuNSONThTXwCvtAw4c9yCaQO0KdQpyq', iterations: 40000, adminPriv: 1, createdByUser: 1 }, //pw: 'admin'
                { id: 2, username: 'user', realName: 'Standard User', pw: 'ZTBfTmM80TDowVs5ymCD/KfSrMeaz9bYt2cB9lIdyw763z5qgYqgsbGzsY9XNocw7qppmFRaBGooxmgSPCM7Ug==', salt: '1OJ3YQeOU4UOAftW7VugpxLyjoJEChmHV2wCxlh7qN2WL40hsAyA27MEKD9yCKsUyX0INWVtxxBYEvIw4Gr11b71QIdOYTSRqWuNSONThTXwCvtAw4c9yCaQO0KdQpyq', iterations: 40000, adminPriv: 0, createdByUser: 1 }, //pw: 'admin'
            ]);
        });
};
