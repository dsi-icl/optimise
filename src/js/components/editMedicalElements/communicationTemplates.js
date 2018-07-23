const visitTitle = (patientId, visitDate, visitType) => (
    visitType === 1 ?
        `Patient with id ${patientId} has a visit on ${visitDate} which has the following observations:`
        :
        `Patient with id ${patientId} has an observation on ${visitDate}:`
);

const testTitle = () => (
    'Tests:'
);

const tests = (testList, typeTable) => {
    if (testList.length === 0) {
        return 'No test was recorded';
    }
    testList.forEach(el => {
        typeTable(el.type) el.expectedOccurDate
    });
};

const eventTitle = () => (
    'Clinical events: '
);

const treatmentTitle = () => (
    'Treatments: '
);
