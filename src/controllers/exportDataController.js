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
            .select('PATIENTS.id', 'PATIENTS.aliasId as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_DEMOGRAPHIC.DOB as BRTHDTC', 'GENDERS.value as SEX', 'DOMINANT_HANDS.value as DOMINANT', 'ETHNICITIES.value as ETHNIC', 'COUNTRIES.value as COUNTRY')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .leftOuterJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
            .leftOuterJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
            .leftOuterJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
            .leftOuterJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .where('PATIENTS.deleted', '-')
            .where('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('BRTHDTC') && entry.BRTHDTC !== null) {
                        entry.BRTHDTC = new Date(entry.BRTHDTC).toString();
                    }
                    convertedResult.push(entry);
                }
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'demographics'));
                }
            });

        /* Smoking history data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId as USUBJID', 'PATIENTS.study as STUDYID', 'SMOKING_HISTORY.value as SCORRES')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
            .leftOuterJoin('SMOKING_HISTORY', 'SMOKING_HISTORY.id', 'PATIENT_DEMOGRAPHIC.smokingHistory')
            .where('PATIENTS.deleted', '-')
            .where('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(result, 'smoking'));
                }
            });

        /* Alcohol consumption data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId as USUBJID', 'PATIENTS.study as STUDYID', 'ALCOHOL_USAGE.value as SUDOSFRQ')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
            .leftOuterJoin('ALCOHOL_USAGE', 'ALCOHOL_USAGE.id', 'PATIENT_DEMOGRAPHIC.alcoholUsage')
            .where('PATIENTS.deleted', '-')
            .where('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(result, 'alcoholConsumption'));
                }
            });

        /* Patient Identifiable Information */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'PATIENT_PII.firstName', 'PATIENT_PII.surname', 'PATIENT_PII.fullAddress', 'PATIENT_PII.postcode')
            .leftOuterJoin('PATIENT_PII', 'PATIENTS.id', 'PATIENT_PII.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_PII.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(result, 'pii'));
                }
            });

        /* Patient pregnancy data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_PREGNANCY.startDate as MHSTDTC', 'PREGNANCY_OUTCOMES.value as MHENRTPT', 'PATIENT_PREGNANCY.outcomeDate as MHENDTC', 'ADVERSE_EVENT_MEDDRA.name as MedDRA')
            .leftOuterJoin('PATIENT_PREGNANCY', 'PATIENT_PREGNANCY.patient', 'PATIENTS.id')
            .leftJoin('PREGNANCY_OUTCOMES', 'PREGNANCY_OUTCOMES.id', 'PATIENT_PREGNANCY.outcome')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_PREGNANCY.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                        entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                    }
                    if (entry.hasOwnProperty('MHENDTC') && entry.MHENDTC !== null) {
                        entry.MHENDTC = new Date(entry.MHENDTC).toString();
                    }
                    convertedResult.push(entry);
                }
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'pregnancy'));
                }
            });

        /* Patient medical history data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId as USUBJID', 'PATIENTS.study as STUDYID', 'RELATIONS.value as SREL', 'CONDITIONS.value as MHTERM', 'MEDICAL_HISTORY.startDate as MHSTDTC', 'MEDICAL_HISTORY.outcome as MHENRTPT', 'MEDICAL_HISTORY.resolvedYear as MHENDTC')
            .leftOuterJoin('MEDICAL_HISTORY', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
            .leftOuterJoin('RELATIONS', 'RELATIONS.value', 'MEDICAL_HISTORY.relation')
            .leftOuterJoin('CONDITIONS', 'CONDITIONS.value', 'MEDICAL_HISTORY.conditionName')
            .where('PATIENTS.deleted', '-')
            .andWhere('MEDICAL_HISTORY.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                        entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                    }
                    convertedResult.push(entry);
                }
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'medicalHistory'));
                }
            });

        /* Patient immunisation data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'PATIENT_IMMUNISATION.vaccineName as MHTERM', 'PATIENT_IMMUNISATION.immunisationDate as MHSTDTC')
            .leftOuterJoin('PATIENT_IMMUNISATION', 'PATIENTS.id', 'PATIENT_IMMUNISATION.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_IMMUNISATION.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                        entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                    }
                    convertedResult.push(entry);
                }
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'immunisation'));
                }
            });

        /* Patient diagnosis data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId as USUBJID', 'PATIENT_DIAGNOSIS.diagnosisDate as MHSTDTC', 'AVAILABLE_DIAGNOSES.value as MHTERM')
            .leftOuterJoin('PATIENT_DIAGNOSIS', 'PATIENT_DIAGNOSIS.patient', 'PATIENTS.id')
            .leftOuterJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_DIAGNOSIS.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('MHSTDTC') && entry.MHSTDTC !== null) {
                        entry.MHSTDTC = new Date(entry.MHSTDTC).toString();
                    }
                    convertedResult.push(entry);
                }
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'diagnosis'));
                }
            });

        /* Patient visit data */

        knex('VISIT_DATA')
            .select('VISIT_DATA.value', 'VISIT_DATA.field', 'VISITS.visitDate', 'AVAILABLE_FIELDS_VISITS.definition', 'PATIENTS.aliasId', 'VISITS.patient')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('VISIT_DATA.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('visitDate') && entry.visitDate !== null) {
                        entry.visitDate = new Date(entry.visitDate).toString();
                    }
                    convertedResult.push(entry);
                }                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'visit'));
                }
            });

        /* Patient test data */

        knex('TEST_DATA')
            .select('TEST_DATA.value', 'TEST_DATA.field', 'ORDERED_TESTS.expectedOccurDate', 'ORDERED_TESTS.actualOccurredDate', 'AVAILABLE_FIELDS_TESTS.definition', 'VISITS.patient', 'ORDERED_TESTS.orderedDuringVisit', 'PATIENTS.aliasId')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('TEST_DATA.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('expectedOccurDate') && entry.expectedOccurDate !== null) {
                        entry.expectedOccurDate = new Date(entry.expectedOccurDate).toString();
                    }
                    if (entry.hasOwnProperty('actualOccurredDate') && entry.actualOccurredDate !== null) {
                        entry.actualOccurredDate = new Date(entry.actualOccurredDate).toString();
                    }
                    convertedResult.push(entry);
                }
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'test'));
                }
            });

        /* Patient clinical event data - visit not required */

        knex('CLINICAL_EVENTS_DATA')
            .select('PATIENTS.aliasId as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_CLINICAL_EVENT_TYPES.name as CETERM', 'CLINICAL_EVENTS_DATA.value as CELAT', 'CLINICAL_EVENTS.dateStartDate as CESTDTC', 'CLINICAL_EVENTS.endDate as CEENDTC', 'ADVERSE_EVENT_MEDDRA.name as MedDRA', 'AVAILABLE_FIELDS_CE.definition as CEBODSYS')
            .leftOuterJoin('CLINICAL_EVENTS', 'CLINICAL_EVENTS.id', 'CLINICAL_EVENTS_DATA.clinicalEvent')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
            .leftOuterJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'AVAILABLE_FIELDS_CE.referenceType')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .where('CLINICAL_EVENTS_DATA.deleted', '-')
            .then(result => {
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
                if (result.length >= 1) {
                    fileArray.push(new createDataFile(convertedResult, 'clinicalEvent'));
                }
            });

        /* Patient treatment data */

        knex('TREATMENTS')
            .select('TREATMENTS.orderedDuringVisit', 'AVAILABLE_DRUGS.name as EXTRT', 'TREATMENTS.dose as EXDOSE', 'TREATMENTS.unit', 'TREATMENTS.form as EXFORM', 'TREATMENTS.timesPerDay', 'TREATMENTS.durationWeeks', 'TREATMENTS.terminatedDate as EXENDTC', 'TREATMENTS.terminatedReason', 'AVAILABLE_DRUGS.module as EXCAT', 'PATIENTS.study as STUDYID', 'PATIENTS.aliasId as USUBJID', 'TREATMENTS_INTERRUPTIONS.startDate as EXSTDTC', 'TREATMENTS_INTERRUPTIONS.endDate as EXENDTC', 'TREATMENTS_INTERRUPTIONS.reason as REASON', 'ADVERSE_EVENT_MEDDRA.name as MedDRA')
            .leftOuterJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
            .leftOuterJoin('TREATMENTS_INTERRUPTIONS', 'TREATMENTS_INTERRUPTIONS.treatment', 'TREATMENTS.id')
            .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('TREATMENTS.deleted', '-')
            .then(result => {
                let convertedResult = [];
                for (let i = 0; i < result.length; i++) {
                    let entry = Object.assign(result[i]);
                    if (entry.hasOwnProperty('EXENDTC') && entry.EXENDTC !== null) {
                        entry.EXENDTC = new Date(entry.EXENDTC).toString();
                    }
                    if (entry.hasOwnProperty('EXSTDTC') && entry.EXSTDTC !== null) {
                        entry.EXSTDTC = new Date(entry.EXSTDTC).toString();
                    }
                    if (entry.hasOwnProperty('EXENDTC') && entry.EXENDTC !== null) {
                        entry.EXENDTC = new Date(entry.EXENDTC).toString();
                    }
                    convertedResult.push(entry);
                }
                if (result.length >= 1) {
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
