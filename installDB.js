/*eslint no-console: "off"*/
const knex = require('./src/utils/db-connection');
const fs = require('fs');

function migrateAndSeed() {
    switch (process.argv[2]) {
        case 'testing':
            knex.migrate.latest({ directory: './db/migrations' })
                .then(() => knex.seed.run({ directory: './db/seed' }))
                .then(() => knex.seed.run({ directory: './db/exampleDataForTesting/seed' }))
                .then(() => console.log('CREATED DATABASE AND POPULATED WITH MS MODULES AND TESTING DATA'))
                .then(() => knex.destroy())
                .catch(err => { console.log(err); knex.destroy(); });
            break;
        case  'MS_fields':
            knex.migrate.latest({ directory: './db/migrations' })
                .then(() => knex.seed.run({ directory: './db/seed' }))
                .then(() => console.log('CREATED DATABASE AND POPULATED WITH MS MODULES'))
                .then(() => knex.destroy())
                .catch(err => { console.log(err); knex.destroy(); });
            break;
        case 'bare':
            knex.migrate.latest({ directory: './db/migrations' })
                .then(() => console.log('CREATED DATABASE WITH BARE SCHEMA'))
                .then(() => knex.destroy())
                .catch(err => { console.log(err); knex.destroy(); });
            break;
        default:
            console.log(`Error: please provide the correct argument. USAGE: node ${process.argv[1]} [testing / MS_fields / bare]`);
    }
}

if (fs.existsSync(knex.client.config.connection.filename))
    fs.unlinkSync(knex.client.config.connection.filename);
migrateAndSeed();
// try {
//     fs.accessSync(knex.client.config.connection.filename);
//     fs.unlink(knex.client.config.connection.filename);
//     migrateAndSeed();
// } catch (err) {
//     migrateAndSeed();
// }

