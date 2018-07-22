const { readJson } = require('../../src/utils/load-json');

const availableDiagnoses = readJson('./db/availableFields/jsonFiles/diagnoses.json');

module.exports = availableDiagnoses;