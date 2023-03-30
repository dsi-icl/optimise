import knex from 'knex';

let connection;
//filename: process.env.NODE_ENV === 'test' ? ':memory:' : global.config.optimiseDBLocation
export default () => {
    if (connection === undefined)
        connection = knex({
            client: 'sqlite3',
            connection: {
                filename: 'testOptimiseDB'
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
