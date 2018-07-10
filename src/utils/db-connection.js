const path = require('path');
const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: path.normalize(`${path.dirname(__filename)}/../../db/optimise-db.sqlite`) },
    pool: {
        afterCreate: function (conn, cb) {
            conn.run('PRAGMA foreign_keys = ON', cb);      ///set timezone ="UTC" ????
        }
    },
    useNullAsDefault: true
});

module.exports = knex;