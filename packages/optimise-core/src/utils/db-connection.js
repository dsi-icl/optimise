import knex from 'knex';
import config from '../core/options';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: process.env.NODE_ENV === 'test' ? ':memory:' : config.optimiseDBLocation
    },
    pool: {
        afterCreate: (conn, cb) => {
            conn.run('PRAGMA foreign_keys = ON', cb);      ///set timezone ="UTC" ????
        }
    },
    useNullAsDefault: true,
    multipleStatements: true
});

export default connection;
