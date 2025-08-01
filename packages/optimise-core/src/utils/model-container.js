/**
 * @description Contains all the models needed for seed
 */

import fieldModels from '../models/availableField';

import typeModels from '../models/availableType';

const container = {};

for (let i = 0; i < Object.keys(fieldModels).length; i++) {
    container[Object.keys(fieldModels)[i]] = fieldModels[Object.keys(fieldModels)[i]];
}

for (let i = 0; i < Object.keys(typeModels).length; i++) {
    container[`${Object.keys(typeModels)[i]}`] = typeModels[Object.keys(typeModels)[i]];
}

export default container;
