module.exports = {
    client: 'sqlite3',
    connection: {
        filename: process.env.NODE_ENV === 'test' ? ':memory:' : 'db/optimise-db.sqlite'
    },
    migrations: {
        directory: 'db/migrations'
    },
    seeds: {
        directory: 'db/seeds'
    },
    pool: {
        afterCreate: (conn, cb) => {
            conn.run('PRAGMA foreign_keys = ON', cb);      ///set timezone ="UTC" ????
        }
    },
    useNullAsDefault: true,
    multipleStatements: true
};
