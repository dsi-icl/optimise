/*eslint no-console: "off"*/
const { eraseAndMigrate } = require('./src/utils/db-handler');

if (process.argv.length < 3)
    console.log(`Error: please provide the correct argument. USAGE: node ${process.argv[1]} [testing / MS_fields / bare]`);
else
    eraseAndMigrate(process.argv[2]);