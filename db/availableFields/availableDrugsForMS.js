const { readJson } = require('../../src/utils/load-json');

const availableDrugs = readJson('./db/availableFields/jsonFiles/drugs.json');

module.exports = availableDrugs;


