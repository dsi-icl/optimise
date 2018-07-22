const { readJson } = require('../../src/utils/load-json');

const availableTypes = readJson('./db/availableFields/jsonFiles/types.json');

module.exports = availableTypes;