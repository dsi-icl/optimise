import knex from 'knex';

let connection;

export default () => {
    if (connection === undefined)
        connection = knex({
            client: 'sqlite3',
            connection: {
                filename: process.env.NODE_ENV === 'test' ? ':memory:' : global.config.optimiseDBLocation
            },
            pool: {
                afterCreate: (conn, cb) => {
                    conn.run('PRAGMA foreign_keys = ON', cb);      ///set timezone ="UTC" ????
                },
                idleTimeoutMillis: 60 * 1000 * 5,
                reapIntervalMillis: 60 * 1000 * 5,
                createRetryIntervalMillis: 60 * 1000 * 5,
                createTimeoutMillis: 60 * 1000 * 5,
                destroyTimeoutMillis: 60 * 1000 * 5,
                acquireTimeoutMillis: 60 * 1000 * 5
            },
            useNullAsDefault: true,
            multipleStatements: true
        });
    return connection;
};
