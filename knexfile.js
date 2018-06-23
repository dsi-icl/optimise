// Update with your config settings.

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './db/optimise-db.sqlite'
        },
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seed'
        },
        useNullAsDefault: true,
        multipleStatements: true
    },

};
