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
                }
            },
            useNullAsDefault: true,
            multipleStatements: true
        });
    return connection;
};
