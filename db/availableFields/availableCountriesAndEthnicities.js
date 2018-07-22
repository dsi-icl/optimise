const { readJson } = require('../../src/utils/load-json');

const availableCountriesAndEthnicities = readJson('./db/availableFields/jsonFiles/countriesAndEthnicities.json');

module.exports = availableCountriesAndEthnicities;
