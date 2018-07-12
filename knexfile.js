const path = require('path');
module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.normalize('./db/optimise-db.sqlite')
    },
    migrations: {
        directory: path.normalize(`${path.dirname(__filename)}/db/migrations`)
    },
    seeds: {
        directory: path.normalize(`${path.dirname(__filename)}/db/seed`)
    },
    pool: {
        afterCreate: function (conn, cb) {
            conn.run('PRAGMA foreign_keys = ON', cb);      ///set timezone ="UTC" ????
        }
    },
    useNullAsDefault: true,
    multipleStatements: true
};
