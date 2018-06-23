/* run 'knex seed:run' here to seed the db with example data*/

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: '../optimise-db.sqlite'
        },
        migrations: {
            directory: '.'
        },
        seeds: {
            directory: './seed'
        },
        useNullAsDefault: true,
        multipleStatements: true
    },

};
