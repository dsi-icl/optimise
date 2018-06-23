// Update with your config settings.

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './optimise-db.sqlite'
        },
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seed'
        },
        useNullAsDefault: true,
        multipleStatements: true
    },

};
