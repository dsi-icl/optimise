/* Export data for all patients */

const knex = require('../utils/db-connection');
const fs = require('fs');
const path = require('path');
require('express-zip');

class ExportDataController {

    exportDatabase(__unused__req, res) {

        const fileName = 'OptimiseData.csv';
        let fileArray = [];

        /* Patient demographic data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID',
                'PATIENT_DEMOGRAPHIC.DOB as BRTHDTC',
                'GENDERS.value as SEX', 'DOMINANT_HANDS.value as DOMINANT',
                'ETHNICITIES.value as ETHNIC', 'COUNTRIES.value as COUNTRY')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .leftOuterJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
            .leftOuterJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
            .leftOuterJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
            .leftOuterJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('BRTHDTC') && entry.BRTHDTC !== null) {
                            entry.BRTHDTC = new Date(entry.BRTHDTC).toString();
                        }
                        entry.DOMAIN = 'DM';
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'DM'));
                }
            });

        /* Smoking history data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID',
                'SMOKING_HISTORY.value as SCORRES')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
            .leftOuterJoin('SMOKING_HISTORY', 'SMOKING_HISTORY.id', 'PATIENT_DEMOGRAPHIC.smokingHistory')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(result, 'smoking'));
                }
            });

        /* Alcohol consumption data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID',
                'ALCOHOL_USAGE.value as SUDOSFRQ')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
            .leftOuterJoin('ALCOHOL_USAGE', 'ALCOHOL_USAGE.id', 'PATIENT_DEMOGRAPHIC.alcoholUsage')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(result, 'alcoholConsumption'));
                }
            });

        /* Patient pregnancy data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID',
                'PATIENT_PREGNANCY.startDate as MHSTDTC',
                'PREGNANCY_OUTCOMES.value as MHENRTPT', 'PATIENT_PREGNANCY.outcomeDate as MHENDTC',
                'ADVERSE_EVENT_MEDDRA.name as MedDRA')
            .leftOuterJoin('PATIENT_PREGNANCY', 'PATIENT_PREGNANCY.patient', 'PATIENTS.id')
            .leftJoin('PREGNANCY_OUTCOMES', 'PREGNANCY_OUTCOMES.id', 'PATIENT_PREGNANCY.outcome')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_PREGNANCY.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                            entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                        }
                        if (entry.hasOwnProperty('MHENDTC') && entry.MHENDTC !== null) {
                            entry.MHENDTC = new Date(entry.MHENDTC).toString();
                        }
                        entry.DOMAIN = 'MH';
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'pregnancy'));
                }
            });

        /* Patient vital signs data (within Visit) domain:VS */

        knex('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID',
                'AVAILABLE_FIELDS_VISITS.definition as VSTEST',
                'VISIT_DATA.value as VSORRES', 'AVAILABLE_FIELDS_VISITS.unit as VSORRESU',
                'VISITS.visitDate as VSDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 1)
            .then(result => {
                if (result.length >= 1) {
                    let newResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        entry.DOMAIN = 'VS';
                    }
                    fileArray.push(new createDataFile(newResult, 'VS'));
                }
            });

        /* Patient Laboratory Test data domain:LB */

        knex('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID',
                'AVAILABLE_FIELDS_TESTS.definition as LBTEST', 'TEST_DATA.value as LBORRES',
                'ORDERED_TESTS.actualOccurredDate as LBDTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .leftOuterJoin('VISITS', 'VISITS.id', 'TEST_DATA.test')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_TESTS.id', 1)
            .then(result => {
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(result, 'LB'));
                }
            });


        /* Patient medical history data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'RELATIONS.value as SREL',
                'CONDITIONS.value as MHTERM', 'MEDICAL_HISTORY.startDate as MHSTDTC', 'MEDICAL_HISTORY.outcome as MHENRTPT',
                'MEDICAL_HISTORY.resolvedYear as MHENDTC')
            .leftOuterJoin('MEDICAL_HISTORY', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
            .leftOuterJoin('RELATIONS', 'RELATIONS.value', 'MEDICAL_HISTORY.relation')
            .leftOuterJoin('CONDITIONS', 'CONDITIONS.value', 'MEDICAL_HISTORY.conditionName')
            .where('PATIENTS.deleted', '-')
            .andWhere('MEDICAL_HISTORY.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                            entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                        }
                        entry.DOMAIN = 'MH';
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'medicalHistory'));
                }
            });

        /* Patient immunisation data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_IMMUNISATION.vaccineName as MHTERM',
                'PATIENT_IMMUNISATION.immunisationDate as MHSTDTC')
            .leftOuterJoin('PATIENT_IMMUNISATION', 'PATIENT_IMMUNISATION.id', 'PATIENTS.id')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_IMMUNISATION.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                            entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                        }
                        entry.DOMAIN = 'MH';
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'immunisation'));
                }
            });

        /* Patient diagnosis data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_DIAGNOSIS.diagnosisDate as MHSTDTC',
                'AVAILABLE_DIAGNOSES.value as MHTERM')
            .leftOuterJoin('PATIENT_DIAGNOSIS', 'PATIENT_DIAGNOSIS.patient', 'PATIENTS.id')
            .leftOuterJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_DIAGNOSIS.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                            entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                        }
                        entry.DOMAIN = 'MH';
                        entry.MHCAT = 'PRIMARY DIAGNOSIS';
                        entry.MHSCAT = 'ONSET COURSE';
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'MH_diagnosis'));
                }
            });

        /* Patient CE data */

        knex('CLINICAL_EVENTS')
            .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_CLINICAL_EVENT_TYPES.name as CETERM',
                'CLINICAL_EVENTS.dateStartDate as CESTDTC', 'CLINICAL_EVENTS.endDate as CEENDTC',
                'CLINICAL_EVENTS_DATA.value as CESEV', 'AVAILABLE_FIELDS_CE.id as fieldId',
                'CLINICAL_EVENTS_DATA.field', 'CLINICAL_EVENTS_DATA.deleted')
            .leftOuterJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'CLINICAL_EVENTS.type')
            .leftOuterJoin('CLINICAL_EVENTS_DATA', 'CLINICAL_EVENTS_DATA.clinicalEvent', 'CLINICAL_EVENTS.id')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let newResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('fieldId') && entry.hasOwnProperty('CESEV') && entry.fieldId !== 9) {
                            entry.CESEV = null;
                        }
                        entry.DOMAIN = 'CE';
                        delete entry.fieldId;
                        delete entry.deleted;
                        delete entry.field;
                        newResult.push(entry);
                    }
                    fileArray.push(new createDataFile(newResult, 'CE'));
                }
            });

        /* Patient visit data */

        knex('VISIT_DATA')
            .select('VISIT_DATA.value', 'VISIT_DATA.field', 'VISITS.visitDate', 'AVAILABLE_FIELDS_VISITS.definition',
                'PATIENTS.uuid', 'VISITS.patient')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('VISIT_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('visitDate') && entry.visitDate !== null) {
                            entry.visitDate = new Date(entry.visitDate).toString();
                        }
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'visit'));
                }
            });

        /* Patient Evoked Potential test data */

        knex('TEST_DATA')
            .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_TESTS.cdiscName as NVTEST',
                'TEST_DATA.value as NVORRES', 'AVAILABLE_FIELDS_TESTS.unit as NVORRESU', 'AVAILABLE_FIELDS_TESTS.laterality as NVLAT',
                'ORDERED_TESTS.actualOccurredDate as NVDTC', 'ORDERED_TESTS.expectedOccurDate as VISITDY')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('ORDERED_TESTS.type', 2)
            .andWhere('TEST_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let newResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('visitDate') && entry.visitDate !== null) {
                            entry.visitDate = new Date(entry.visitDate).toString();
                        }
                        entry.DOMAIN = 'NV';
                        newResult.push(entry);
                    }
                    fileArray.push(new createDataFile(newResult, 'NV'));
                }
            });

        /* Patient test data */

        /* Patient clinical event data - visit not required */

        knex('CLINICAL_EVENTS_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_CLINICAL_EVENT_TYPES.name as CETERM', 'CLINICAL_EVENTS_DATA.value as CELAT', 'CLINICAL_EVENTS.dateStartDate as CESTDTC', 'CLINICAL_EVENTS.endDate as CEENDTC', 'ADVERSE_EVENT_MEDDRA.name as MedDRA', 'AVAILABLE_FIELDS_CE.definition as CEBODSYS')
            .leftOuterJoin('CLINICAL_EVENTS', 'CLINICAL_EVENTS.id', 'CLINICAL_EVENTS_DATA.clinicalEvent')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
            .leftOuterJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'AVAILABLE_FIELDS_CE.referenceType')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .where('CLINICAL_EVENTS_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('CESTDTC') && entry.CESTDTC !== null) {
                            entry.CESTDTC = new Date(entry.CESTDTC).toString();
                        }
                        if (entry.hasOwnProperty('CEENDTC') && entry.CEENDTC !== null) {
                            entry.CEENDTC = new Date(entry.CEENDTC).toString();
                        }
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'clinicalEvent'));
                }
            });

        /* Patient treatment data */

        knex('TREATMENTS')
            .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_DRUGS.name as EXTRT',
                'AVAILABLE_DRUGS.module as EXCLAS', 'TREATMENTS.dose as EXDOSE', 'TREATMENTS.unit as EXDOSU',
                'TREATMENTS.timesPerDay as EXDOSFRQ', 'TREATMENTS.form as EXROUTE', 'TREATMENTS_INTERRUPTIONS.startDate as EXSTDTC_2',
                'TREATMENTS.terminatedDate as EXENDTC', 'TREATMENTS.terminatedReason',
                'TREATMENTS_INTERRUPTIONS.endDate as EXENDTC_2', 'REASONS.value as REASON',
                'ADVERSE_EVENT_MEDDRA.name as trtMedDRA')
            .leftOuterJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
            .leftOuterJoin('TREATMENTS_INTERRUPTIONS', 'TREATMENTS_INTERRUPTIONS.treatment', 'TREATMENTS.id')
            .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('REASONS', 'REASONS.id', 'TREATMENTS_INTERRUPTIONS.reason')
            .where('TREATMENTS.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    let convertedResult = [];
                    for (let i = 0; i < result.length; i++) {
                        let entry = Object.assign(result[i]);
                        if (entry.hasOwnProperty('EXSTDTC') && entry.EXSTDTC !== null) {
                            entry.EXSTDTC = new Date(entry.EXSTDTC).toString();
                        }
                        if (entry.hasOwnProperty('EXENDTC') && entry.EXENDTC !== null) {
                            entry.EXENDTC = new Date(entry.EXENDTC).toString();
                        }
                        entry.DOMAIN = 'EX';
                        convertedResult.push(entry);
                    }
                    fileArray.push(new createDataFile(convertedResult, 'treatment'));
                }
                zipFiles(fileArray);
            });

        /* function to create a csv file for the result passed as an argument- prefix: (string) filename */

        function createDataFile(result, prefix) {

            const tempfileName = `${prefix}${fileName}`;
            let keys = Object.keys(result[0]); // get the keys from result to create headers
            //keys.push('domain');
            // let newKeys;
            // if (mapping !== null) {
            //     newKeys = keys.map(x => mapping[x]);
            // } else {
            //     newKeys = keys;
            // }
            let tempResult = `${keys.join(',')}\n`;
            result.forEach(function(obj) {
                keys.forEach(function(a, b){
                    if (b) tempResult += ',';
                    tempResult += obj[a];
                });
                tempResult += '\n';
            });
            let fileContents = Buffer.from(tempResult);
            // check if dir temp exists
            const dir = './temp/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let tempSavedPath = `${dir}${tempfileName}`;
            tempSavedPath = path.normalize(tempSavedPath);
            fs.writeFile(tempSavedPath, fileContents, err => {
                if (err) {
                    return;
                }
            });
            return { path: tempSavedPath, name: tempfileName };
        }

        /* creates a zip attachment- arr: an array of file paths and file names */

        function zipFiles(arr) {
            if (arr.length >= 1) {
                res.status(200).zip(arr);
            } else {
                res.status(204).send('There are no patient entries in the database.');
            }
        }
    }
}

module.exports = ExportDataController;
