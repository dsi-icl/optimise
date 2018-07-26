/**
 * @description Contains all the models needed for seed
 */

const fieldModels = require('../models/availableField');
const typeModels = require('../models/availableType');

const container = {};

for (let i = 0; i < Object.keys(fieldModels).length; i++) {
    container[Object.keys(fieldModels)[i]] = fieldModels[Object.keys(fieldModels)[i]];
}

for (let i = 0; i < Object.keys(typeModels).length; i++) {
    container[`${Object.keys(typeModels)[i]}`] = typeModels[Object.keys(typeModels)[i]];
}

module.exports = container;