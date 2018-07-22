const { readJson } = require('../../src/utils/load-json');

const availableConditions = readJson('./db/availableFields/jsonFiles/conditions.json');

module.exports = availableConditions;