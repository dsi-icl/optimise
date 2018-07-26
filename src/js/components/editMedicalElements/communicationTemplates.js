//all test block in draft-js has a key. To make the templates below pure functions a keygen is defined here.
const keygen = () => Math.random().toString(35).slice(2,8);


/* blockgen() has to called when the user has clicked to insert, 
    instead of before the editor initialises or else if the user click insert twice,
    two blocks with the same string will be added.
*/
export const blockgen = (text, inlineStyleRanges) => ({
    key: keygen(),
    text,
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges,
    entityRanges: [],
    data: {}
});


/* all the "typeTable" parameters below are hashTables for the types */
export const visitTitle = (patientId, visitDate, visitType) => (
    visitType === 1 ?
        blockgen(
            `Patient with id ${patientId} has a visit on ${new Date(parseInt(visitDate)).toDateString()} which has the following observations:`,
            [{
                offset: 16,
                length: patientId.length,
                style: 'BOLD'
            },
            {
                offset: 16 + patientId.length + 16,
                length: new Date(parseInt(visitDate)).toDateString().length,
                style: 'BOLD'
            }]
        )
        :
        blockgen(
            `Patient with id ${patientId} has an observation on ${visitDate}:`,
            [{
                offset: 16,
                length: patientId.length,
                style: 'BOLD'
            },
            {
                offset: 16 + patientId.length + 23,
                length: new Date(parseInt(visitDate)).toDateString().length,
                style: 'BOLD'
            }]
        )
);


/*  for formating tests  */
export const testTitle = () => (
    'Tests:'
);

const oneTest = (test, typeTable) => {
    const name = typeTable[test.type];
    const date = new Date(parseInt(test.expectedOccurDate)).toDateString();
    return `- ${name}: ${date}`;
}

export const formatTests = (testList, typeTable) => {
    if (testList.length === 0) {
        return () => [blockgen(testTitle(), [{ offset: 0, length: 6, style: 'BOLD' }]), blockgen('No test was recorded.', [])];
    }
    const strings = testList.map(el => oneTest(el, typeTable));
    return () => [blockgen(testTitle(), [{ offset: 0, length: 6, style: 'BOLD' }]), ...strings.map(el => blockgen(el, []))];
};


/* for formating events */
export const eventTitle = () => (
    'Clinical events:'
);

const oneEvent = (event, typeTable) => {
    const name = typeTable[event.type];
    const date = new Date(parseInt(event.dateStartDate)).toDateString();
    return `- ${name}: ${date}`;
}

export const formatEvents = (eventList, typeTable) => {
    if (eventList.length === 0) {
        return () => [blockgen(eventTitle(), [{ offset: 0, length: 16, style: 'BOLD' }]), blockgen('No clinical event was recorded.', [])];
    }
    const strings = eventList.map(el => oneEvent(el, typeTable));
    return () => [blockgen(eventTitle(), [{ offset: 0, length: 16, style: 'BOLD' }]), ...strings.map(el => blockgen(el, []))];
};



/* for formating events */
const treatmentTitle = () => (
    'Treatments:'
);

const oneTreatment = (treatment, typeTable) => {
    const drugObj = typeTable[treatment.drug];
    let name;
    if (drugObj) {
        name = drugObj.name;
    }
    const date = new Date(parseInt(treatment.visitDate)).toDateString();
    return `- ${name}: ${date}`;
}

export const formatTreatments = (treatmentList, typeTable) => {
    if (treatmentList.length === 0) {
        return () => [blockgen(treatmentTitle(), [{ offset: 0, length: 11, style: 'BOLD' }]), blockgen('No treatment was recorded.', [])];
        
    }
    const strings = treatmentList.map(el => oneTreatment(el, typeTable));
    return () => [blockgen(treatmentTitle(), [{ offset: 0, length: 11, style: 'BOLD' }]), ...strings.map(el => blockgen(el, []))];
};
