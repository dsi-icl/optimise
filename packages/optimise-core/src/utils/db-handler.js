/*eslint no-console: "off"*/
const knex = require('./db-connection');
const fs = require('fs');

function migrate(type) {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'testing':
                if (process.env.NODE_ENV !== 'production') console.log('Migrating database with MS modules and testing data ...');
                return knex.migrate.latest({ directory: 'db/migrations' })
                    .then(() => knex.seed.run({ directory: 'db/seeds' }))
                    .then(() => knex.seed.run({ directory: 'db/exampleDataForTesting/seed' }))
                    .then(() => resolve())
                    .catch(err => reject(err));
            case 'ms':
                if (process.env.NODE_ENV !== 'production') console.log('Migrating database ...');
                return knex.migrate.latest({ directory: 'db/migrations' })
                    .then(() => knex.select('id').from('COUNTRIES'))
                    .then((result) => {
                        if (result.length === 0) {
                            if (process.env.NODE_ENV !== 'production') console.log('Applying MS seeds ...');
                            return knex.seed.run({ directory: 'db/seeds' });
                        }
                        return true;
                    })
                    .then(() => resolve())
                    .catch(err => reject(err));
            case 'bare':
                if (process.env.NODE_ENV !== 'production') console.log('Migrating database ...');
                return knex.migrate.latest({ directory: 'db/migrations' })
                    .then(() => resolve())
                    .catch(err => reject(err));
            default:
                return reject('Wrong parameter used');
        }
    });
}

function erase() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') console.log('Removing database file ...');
        let filename = knex.client.config.connection.filename;
        try {
            if (fs.existsSync(filename))
                fs.unlinkSync(filename);
        } catch (err) {
            return reject(err);
        }
        return resolve();
    });
}

exports.migrate = migrate;
exports.erase = erase;
