/*eslint no-console: "off"*/
const { erase, migrate } = require('./src/utils/db-handler');

if (process.argv.length < 3)
    console.error(`Error: please provide the correct argument. USAGE: node ${process.argv[1]} [testing / MS_fields / bare]`);
else
    erase().then(() => migrate('testing').catch(err => console.error(err))).catch(err => console.error(err));