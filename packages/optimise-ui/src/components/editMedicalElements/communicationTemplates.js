import moment from 'moment';
import { edssAlgorithmFromProps } from '../EDSScalculator/calculator';

// all test block in draft-js has a key. To make the templates below pure functions a keygen is defined here.
const keygen = () => Math.random().toString(35).slice(2, 8);

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
    visitType === 1
        ? blockgen(
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
        : blockgen(
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
export const testTitle = duration => (
    `Tests (going back ${duration === 2000 ? 'the whole history' : moment.duration(duration, 'months').humanize()}):`
);

const oneTest = (test, typeTable) => {
    const name = typeTable[0][test.type];
    const dateDone = test.expectedOccurDate ? new Date(parseInt(test.expectedOccurDate)).toDateString() : '';
    let result = `> ${name}: Test done on ${dateDone}\n`;
    // const dateResults = test.actualOccurredDate ? new Date(parseInt(test.actualOccurredDate)).toDateString() : dateDone;
    // let result = `> ${name}: Test done on ${dateDone}, Results processed on ${dateResults}\n`;
    test.data.forEach((el) => {
        result += `- ${typeTable[1][el.field].definition}: ${el.value}\n`;
    });
    return result;
};

export const formatTests = (testList, typeTable, duration) => {
    if (testList.length === 0) {
        return () => [
            blockgen(''),
            blockgen(testTitle(duration), [{ offset: 0, length: 6, style: 'BOLD' }]),
            blockgen('No test was recorded.', [])
        ];
    }
    const strings = testList.map(el => oneTest(el, typeTable));
    return () => [
        blockgen(''),
        blockgen(testTitle(duration), [{ offset: 0, length: 6, style: 'BOLD' }]),
        ...strings.map(el => blockgen(el, [{ offset: el.indexOf(':') + 2, length: el.indexOf('\n') - el.indexOf(':'), style: 'ITALIC' }]))
    ];
};

/* for formating events */
export const eventTitle = duration => (
    `Clinical events (going back ${duration === 2000 ? 'the whole history' : moment.duration(duration, 'months').humanize()}):`
);

const oneEvent = (event, typeTable) => {
    const name = typeTable[event.type];
    const date = new Date(parseInt(event.dateStartDate)).toDateString();
    return `- ${name}: ${date}`;
};

export const formatEvents = (eventList, typeTable, duration) => {
    if (eventList.length === 0) {
        return () => [
            blockgen(''),
            blockgen(eventTitle(duration), [{ offset: 0, length: 16, style: 'BOLD' }]),
            blockgen('No clinical event was recorded.', [])
        ];
    }
    const strings = eventList.map(el => oneEvent(el, typeTable));
    return () => [
        blockgen(''),
        blockgen(eventTitle(duration), [{ offset: 0, length: 16, style: 'BOLD' }]),
        ...strings.map(el => blockgen(el, [{ offset: el.lastIndexOf(':') + 2, length: el.length - el.lastIndexOf(':') - 2, style: 'ITALIC' }]))
    ];
};

/* for formating treatment */
const treatmentTitle = duration => (
    `Treatments (going back ${duration === 2000 ? 'the whole history' : moment.duration(duration, 'months').humanize()}):`
);

const oneTreatment = (treatment, typeTable) => {
    const drugObj = typeTable[treatment.drug];
    let name;
    if (drugObj) {
        name = drugObj.name;
    }
    const date = new Date(parseInt(treatment.visitDate)).toDateString();
    return `- ${name}: ${date}`;
};

export const formatTreatments = (treatmentList, typeTable, duration) => {
    if (treatmentList.length === 0) {
        return () => [
            blockgen(''),
            blockgen(treatmentTitle(duration), [{ offset: 0, length: 100, style: 'BOLD' }]),
            blockgen('No treatment was recorded.', [])
        ];
    }
    const strings = treatmentList.map(el => oneTreatment(el, typeTable));
    return () => [
        blockgen(''),
        blockgen(treatmentTitle(duration), [{ offset: 0, length: 100, style: 'BOLD' }]),
        ...strings.map(el => blockgen(el, [{ offset: el.lastIndexOf(':') + 2, length: el.length - el.lastIndexOf(':') - 2, style: 'ITALIC' }]))
    ];
};

const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

const oneSignOrSymptom = (data, VSFields_Hash) => {
    const fieldObj = VSFields_Hash[data.field];
    if (fieldObj) {
        if (fieldObj.type === 5) {
            return `- ${fieldObj.idname.replace(/:/g, ' > ')}: ${data.value === '1' ? 'Yes' : (data.value === '0' ? 'No' : 'Unknown')}`;
        }
        return `- ${fieldObj.idname.replace(/:/g, ' > ')}: ${toTitleCase(data.value)}`;
    }
    else {
        return '';
    }
};

export const formatSymptomsAndSigns = (visitData, symptomsTypeTable, signsTypeTable) => {
    if (visitData.length === 0) {
        return () => [
            blockgen(''),
            blockgen('Symptoms & Signs', [{ offset: 0, length: 19, style: 'BOLD' }]),
            blockgen('Neither symptoms nor signs were recorded.', [])
        ];
    }
    const symptoms = visitData.map(el => oneSignOrSymptom(el, symptomsTypeTable)).filter(el => el !== '');
    const signs = visitData.map(el => oneSignOrSymptom(el, signsTypeTable)).filter(el => el !== '');
    return () => [
        blockgen(''),
        blockgen('Symptoms', [{ offset: 0, length: 19, style: 'BOLD' }]),
        ...symptoms.map(el => blockgen(el, [{ offset: el.lastIndexOf(':') + 2, length: el.length - el.lastIndexOf(':') - 2, style: 'ITALIC' }])),
        blockgen(''),
        blockgen('Signs', [{ offset: 0, length: 19, style: 'BOLD' }]),
        ...signs.map(el => blockgen(el, [{ offset: el.lastIndexOf(':') + 2, length: el.length - el.lastIndexOf(':') - 2, style: 'ITALIC' }]))
    ];
};

const VSTitle = () => (
    'Vital signs:'
);

export const formatVS = (VSList, typeTable) => {
    if (VSList.length === 0) {
        return () => [
            blockgen(''),
            blockgen(VSTitle(), [{ offset: 0, length: 12, style: 'BOLD' }]),
            blockgen('No VS was recorded.', [])
        ];
    }
    const strings = VSList.map(el => oneSignOrSymptom(el, typeTable)).filter(el => el !== '');
    return () => [
        blockgen(''),
        blockgen(VSTitle(), [{ offset: 0, length: 12, style: 'BOLD' }]),
        ...strings.map(el => blockgen(el, [{ offset: el.lastIndexOf(':') + 2, length: el.length - el.lastIndexOf(':') - 2, style: 'ITALIC' }]))
    ];
};

/* for formating edss */
const edssTitle = () => (
    'EDSS:'
);

export const formatEdss = (edssList, typeTable) => {
    if (edssList.length === 0) {
        return () => [
            blockgen(''),
            blockgen(edssTitle(), [{ offset: 0, length: 11, style: 'BOLD' }]),
            blockgen('No edss was recorded.', [])
        ];
    }

    const EDSSFields = Object.values(typeTable);
    const EDSSFieldsByName = EDSSFields.reduce((a, el) => ({ ...a, [el.idname]: el.id }), {});
    const estimatedTotalID = EDSSFieldsByName['edss:expanded disability status scale - estimated total'];
    let EDSSComputed = edssAlgorithmFromProps(EDSSFields, edssList);
    const strings = edssList.map((el) => {
        let res = oneSignOrSymptom(el, typeTable);
        if (el.field === estimatedTotalID && EDSSComputed !== '')
            res += `\n- edss > expanded disability status scale - computed total: ${EDSSComputed}`;
        return res;
    }).filter(el => el !== '');
    if (strings.length === 0) {
        return () => [
            blockgen(''),
            blockgen(edssTitle(), [{ offset: 0, length: 11, style: 'BOLD' }]),
            blockgen('No edss was recorded.', [])
        ];
    }
    else {
        return () => [
            blockgen(''),
            blockgen(edssTitle(), [{ offset: 0, length: 5, style: 'BOLD' }]),
            ...strings.map(el => blockgen(el, [{ offset: el.lastIndexOf(':') + 2, length: el.length - el.lastIndexOf(':') - 2, style: 'ITALIC' }]))
        ];
    }
};
