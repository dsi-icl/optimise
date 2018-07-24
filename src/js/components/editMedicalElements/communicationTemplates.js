export const visitTitle = (patientId, visitDate, visitType) => (
    visitType === 1 ?
        `Patient with id ${patientId} has a visit on ${visitDate} which has the following observations:`
        :
        `Patient with id ${patientId} has an observation on ${visitDate}:`
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

export const tests = (testList, typeTable) => {
    if (testList.length === 0) {
        return 'No test was recorded';
    }
    return [...testList].forEach(el => oneTest(el, typeTable));
};


/* for formating events */
export const eventTitle = () => (
    'Clinical events: '
);

const oneEvent = (event, typeTable) => {
    const name = typeTable[event.type];
    const date = new Date(parseInt(event.dateStartDate)).toDateString();
    return `- ${name}: ${date}`;
}

export const events = (eventList, typeTable) => {
    if (eventList.length === 0) {
        return 'No clinical event was recorded';
    }
    return [...eventList].forEach(el => oneEvent(el, typeTable));
};



/* for formating events */
export const treatmentTitle = () => (
    'Treatments: '
);

const oneTreatment = (treatment, typeTable) => {
    const name = typeTable[treatment.type];
    const date = new Date(parseInt(treatment.visitDate)).toDateString();
    return `- ${name}: ${date}`;
}

export const treatments = (treatmentList, typeTable) => {
    if (treatmentList.length === 0) {
        return 'No treatment was recorded';
    }
    return [...treatmentList].forEach(el => oneTreatment(el, typeTable));
};
