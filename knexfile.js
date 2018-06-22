// Update with your config settings.

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './db/optimise-db.sqlite'
        },
        seeds: {
            directory: './seed'
        },
        useNullAsDefault: true,
        multipleStatements: true
    },

};
