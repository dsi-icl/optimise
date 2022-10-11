import knex from 'knex';

let connection;

export default () => {
    if (connection === undefined)
        try {
            connection = knex({
                client: 'sqlite3',
                connection: {
                    filename: process.env.NODE_ENV === 'test' ? ':memory:' : global.config.optimiseDBLocation
                },
                pool: {
                    afterCreate: (conn, cb) => {
                        conn.run('PRAGMA foreign_keys = ON', cb);      ///set timezone ="UTC" ????
                    },
                    min: 0,
                    max: 1,
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
        } catch (e) {
            process.stderr.write('Knex connection init issue\n');
        }
    return connection;
};
