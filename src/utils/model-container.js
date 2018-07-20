/**
 * @description Contains all the models needed for seed
 */

const fieldModels = require('../models/availableField');
const typeModels = require('../models/availableType');

const container = {};

for (let i = 0; i < fieldModels.length; i++) {
    container[Object.keys(fieldModels)[i]] = fieldModels[i];
}

for (let i = 0; i < typeModels.length; i++) {
    container[Object.keys(typeModels)[i]] = typeModels[i];
}

module.exports = container;