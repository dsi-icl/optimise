const makeMeddraSeeds = require('./utils');
const tree = require('./meddra.json');
const { existsSync, writeFile } = require('fs');

const path = './MeddraSeeds.json';

if (existsSync(path)) {
    throw Error('Error: Seed file already exists!');
}

const data = JSON.stringify(makeMeddraSeeds(tree), null, 4);

writeFile(path, data, err => {
    if (err) throw err;
    console.log('SEED FILE GENERATED');
})

