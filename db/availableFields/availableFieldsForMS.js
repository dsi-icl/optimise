const { readJson } = require('../../src/utils/load-json');

const availableFields = readJson('./db/availableFields/jsonFiles/fields.json');

module.exports = availableFields;