/**
 * @description Defines the models of the "availablefields"
 */

const fieldVisit = {
    id: 0,
    definition: '',
    idname: '',
    type: 0,
    unit: null,
    module: null,
    permittedValues: null,
    referenceType: 0
};

const fieldCE = {
    id: 0,
    definition: '',
    idname: '',
    type: 0,
    unit: null,
    module: null,
    permittedValues: null,
    referenceType: 0
};

const fieldTest = {
    id: 0,
    definition: '',
    idname: '',
    type: 0,
    unit: null,
    module: null,
    permittedValues: null,
    referenceType: 0
};

const fieldContainer = {
    fieldCE: fieldCE,
    fieldTest: fieldTest,
    fieldVisit: fieldVisit
};

module.exports = fieldContainer;