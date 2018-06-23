/*eslint no-console: "off"*/
const knex = require('./src/utils/db-connection');

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
        console.log('Error! Please provide argument "testing" (for loading test data), "MS_fields" (for empty database for MS use) or "bare" (only schema)');
}
