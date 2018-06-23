const knex = require('./src/utils/db-connection');

knex.migrate.latest({ directory: './db/migrations' })
    .then(() => knex.seed.run({ directory: './db/seed' }))
    .then(() => knex.seed.run({ directory: './db/exampleDataForTesting/seed' }))
    .then(() => console.log('Finished'))
    .then(() => knex.destroy())
    .catch(err => { console.log(err); knex.destroy(); });