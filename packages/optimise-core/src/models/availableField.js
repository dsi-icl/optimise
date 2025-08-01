/**
 * @description Defines the models of the "availablefields"
 */

const fieldVisit = {
    id: 0,
    definition: '',
    idname: '',
    section: 0,
    subsection: null,
    type: 0,
    unit: null,
    module: null,
    permittedValues: null,
    labels: null,
    referenceType: 0,
    laterality: null,
    cdiscName: null
};

const fieldCE = {
    id: 0,
    definition: '',
    idname: '',
    section: '',
    subsection: '',
    type: 0,
    unit: null,
    module: null,
    permittedValues: null,
    labels: null,
    referenceType: 0,
    laterality: null,
    cdiscName: null
};

const fieldTest = {
    id: 0,
    definition: '',
    idname: '',
    section: null,
    subsection: null,
    type: 0,
    unit: null,
    module: null,
    permittedValues: null,
    labels: null,
    referenceType: 0,
    laterality: null,
    cdiscName: null
};

const fieldContainer = {
    fieldCE: fieldCE,
    fieldTest: fieldTest,
    fieldVisit: fieldVisit
};

export default fieldContainer;
