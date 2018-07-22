const { readJson } = require('../../src/utils/load-json');

const availableLltMedDRA = readJson('./db/availableFields/jsonFiles/medra.json');

module.exports = availableLltMedDRA;