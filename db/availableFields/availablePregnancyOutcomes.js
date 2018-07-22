const { readJson } = require('../../src/utils/load-json');

const availablePregnancyOutcomes = readJson('./db/availableFields/jsonFiles/pregnancyOutcomes.json');

module.exports = availablePregnancyOutcomes;