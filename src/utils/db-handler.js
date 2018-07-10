/*eslint no-console: "off"*/
const knex = require('./db-connection');
const fs = require('fs');
const path = require('path');

function migrate(type) {
    return new Promise((resolve, reject) => {
        switch (type) {
            case 'testing':
                if (process.env.NODE_ENV !== 'production') console.log('Creating database with MS modules and testing data ...');
                return knex.migrate.latest({ directory: path.normalize(`${path.dirname(__filename)}/../../db/migrations`) })
                    .then(() => knex.seed.run({ directory: path.normalize(`${path.dirname(__filename)}/../../db/seed`) }))
                    .then(() => knex.seed.run({ directory: path.normalize(`${path.dirname(__filename)} /../../db/exampleDataForTesting/seed`) }))
                    .then(() => knex.destroy())
                    .then(() => resolve())
                    .catch(err => reject(err));
            case 'MS_fields':
                if (process.env.NODE_ENV !== 'production') console.log('Creating database with MS modules ...');
                return knex.migrate.latest({ directory: path.normalize(`${path.dirname(__filename)}/../../db/migrations`) })
                    .then(() => knex.seed.run({ directory: path.normalize(`${path.dirname(__filename)} /../../db/seed`) }))
                    .then(() => knex.destroy())
                    .then(() => resolve())
                    .catch(err => reject(err));
            case 'bare':
                if (process.env.NODE_ENV !== 'production') console.log('Creating empty database ...');
                return knex.migrate.latest({ directory: path.normalize(`${path.dirname(__filename)}/../../db/migrations`) })
                    .then(() => knex.destroy())
                    .then(() => resolve())
                    .catch(err => reject(err));
            default:
                throw TypeError('Wrong parameter used');
        }
    });
}

function erase() {
    return new Promise((resolve, __unused__reject) => {
        if (process.env.NODE_ENV !== 'production') console.log('Removing database file ...');
        let filename = knex.client.config.connection.filename;
        try {
            if (fs.existsSync(filename))
                fs.unlinkSync(filename);
        } catch (err) {
            //__unused__reject(err);
        }
        resolve();
    });
}

exports.migrate = migrate;
exports.erase = erase;
