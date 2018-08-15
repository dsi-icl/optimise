/* Export data for all patients */

const knex = require('../utils/db-connection');
const message = require('../utils/message-utils');
const { searchEntry } = require('../utils/controller-utils');
const fs = require('fs');
const path = require('path');
require('express-zip');

class ExportDataController {

    exportDatabase(req, res) {

        let queryfield = '';
        let queryvalue = '';
        let noDataArr = [];


        if (Object.keys(req.query).length > 2) {
            noDataArr.push(new createNoDataFile(message.userError.INVALIDQUERY, 'invalidQuery'));
            res.status(400).zip(noDataArr);
            return false;
        }
        if (typeof req.query.field === 'string')
            queryfield = req.query.field;
        else if (req.query.field !== undefined) {
            noDataArr.push(new createNoDataFile(message.userError.INVALIDQUERY, 'invalidQuery'));
            res.status(400).zip(noDataArr);
            return false;
        }
        if (typeof req.query.value === 'string')
            queryvalue = req.query.value;
        else if (req.query.value !== undefined) {
            noDataArr.push(new createNoDataFile(message.userError.INVALIDQUERY, 'invalidQuery'));
            res.status(400).zip(noDataArr);
            return false;
        }

        searchEntry(queryfield, queryvalue).then((result) => {

            /* function to create a json file */

            function createJsonDataFile(result, prefix) {

                const tempJsonFileName = `${prefix}_${Date.now()}_optimise.json`;
                let fileContents = Buffer.from(JSON.stringify(result));
                // check if dir temp exists
                const dir = './temp/';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                let tempSavedPath = `${dir}${tempJsonFileName}`;
                tempSavedPath = path.normalize(tempSavedPath);
                fs.writeFile(tempSavedPath, fileContents, err => {
                    if (err) {
                        return;
                    }
                });
                return { path: tempSavedPath, name: tempJsonFileName };

            }

            /* function to create a csv file for the result passed as an argument- prefix: (string) filename */

            function createCsvDataFile(result, prefix) {

                const tempCsvFileName = `${prefix}_${Date.now()}_optimise.csv`;
                let keys = Object.keys(result[0]); // get the keys from result to create headers
                let tempResult = `${keys.join(',')}\n`;
                result.forEach((obj) => {
                    keys.forEach((a, b) => {
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
                let tempSavedPath = `${dir}${tempCsvFileName}`;
                tempSavedPath = path.normalize(tempSavedPath);
                fs.writeFile(tempSavedPath, fileContents, err => {
                    if (err) {
                        return;
                    }
                });
                return { path: tempSavedPath, name: tempCsvFileName };
            }

            /* creates a zip attachment- arr: an array of file paths and file names */

            function zipFiles(arr) {
                res.status(200).zip(arr);
            }

            let patientArr = [];

            if (result && result.length > 0) {
                result.forEach(x => { patientArr.push(x.patientId); });
                result.forEach((__unused__r, i) => { result[i].uuid = undefined; });
                let dataPromises = [];
                let csvFileArray = [];
                let jsonFileArray = [];

                /* Patient demographic data */

                dataPromises.push(knex('PATIENTS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_DEMOGRAPHIC.DOB as BRTHDTC', 'GENDERS.value as SEX',
                        'DOMINANT_HANDS.value as DOMINANT', 'ETHNICITIES.value as ETHNIC', 'COUNTRIES.value as COUNTRY')
                    .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .leftOuterJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
                    .leftOuterJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
                    .leftOuterJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
                    .leftOuterJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            let convertedResult = [];
                            for (let i = 0; i < result.length; i++) {
                                let entry = Object.assign(result[i]);
                                entry.DOMAIN = 'DM';
                                convertedResult.push(entry);
                            }
                            csvFileArray.push(new createCsvDataFile(convertedResult, 'DM'));
                            jsonFileArray.push(new createJsonDataFile(convertedResult, 'DM'));
                        }
                        return true;
                    }).catch(() => false));

                /* Smoking history data */

                dataPromises.push(knex('PATIENTS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'SMOKING_HISTORY.value as SCORRES')
                    .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
                    .leftOuterJoin('SMOKING_HISTORY', 'SMOKING_HISTORY.id', 'PATIENT_DEMOGRAPHIC.smokingHistory')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            csvFileArray.push(new createCsvDataFile(result, 'SC_smoking'));
                            jsonFileArray.push(new createJsonDataFile(result, 'SC_smoking'));
                        }
                        return true;
                    }).catch(() => false));

                /* Alcohol consumption data */

                dataPromises.push(knex('PATIENTS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ALCOHOL_USAGE.value as SUDOSFRQ')
                    .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
                    .leftOuterJoin('ALCOHOL_USAGE', 'ALCOHOL_USAGE.id', 'PATIENT_DEMOGRAPHIC.alcoholUsage')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.DOMAIN = 'SU';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'SU_alcoholConsumption'));
                            jsonFileArray.push(new createJsonDataFile(result, 'SU_alcoholConsumption'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient pregnancy data */

                dataPromises.push(knex('PATIENTS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_PREGNANCY.startDate as MHSTDTC', 'PREGNANCY_OUTCOMES.value as MHENRTPT',
                        'PATIENT_PREGNANCY.outcomeDate as MHENDTC', 'ADVERSE_EVENT_MEDDRA.name as MHDECOD')
                    .leftOuterJoin('PATIENT_PREGNANCY', 'PATIENT_PREGNANCY.patient', 'PATIENTS.id')
                    .leftJoin('PREGNANCY_OUTCOMES', 'PREGNANCY_OUTCOMES.id', 'PATIENT_PREGNANCY.outcome')
                    .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('PATIENT_PREGNANCY.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            let convertedResult = [];
                            for (let i = 0; i < result.length; i++) {
                                let entry = Object.assign(result[i]);
                                entry.MHCAT = 'GENERAL';
                                entry.DOMAIN = 'MH';
                                convertedResult.push(entry);
                            }
                            csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_Pregnancy'));
                            jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_Pregnancy'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient vital signs data (within Visit) */

                dataPromises.push(knex('VISIT_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as VSTEST', 'VISIT_DATA.value as VSORRES',
                        'AVAILABLE_FIELDS_VISITS.unit as VSORRESU', 'VISITS.visitDate as VSDTC')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
                    .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('VISIT_DATA.deleted', '-')
                    .andWhere('VISITS.deleted', '-')
                    .andWhere('AVAILABLE_FIELDS_VISITS.section', 1)
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.DOMAIN = 'VS';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'VS'));
                            jsonFileArray.push(new createJsonDataFile(result, 'VS'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient Adverse Events data- Pregnancy */

                dataPromises.push(knex('PATIENT_PREGNANCY')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_PREGNANCY.patient')
                    .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('PATIENT_PREGNANCY.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.AETERM = x.AELLT;
                                x.DOMAIN = 'AE';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'AE_Pregnancy'));
                            jsonFileArray.push(new createJsonDataFile(result, 'AE_Pregnancy'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient Adverse Events data- Clinical Events */

                dataPromises.push(knex('CLINICAL_EVENTS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
                    .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('CLINICAL_EVENTS.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.AETERM = x.AELLT;
                                x.DOMAIN = 'AE';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'AE_ClinicalEvents'));
                            jsonFileArray.push(new createJsonDataFile(result, 'AE_ClinicalEvents'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient Adverse Events data- Treatment interruptions */

                dataPromises.push(knex('TREATMENTS_INTERRUPTIONS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
                    .leftOuterJoin('TREATMENTS', 'TREATMENTS.id', 'TREATMENTS_INTERRUPTIONS.treatment')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('TREATMENTS_INTERRUPTIONS.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.AETERM = x.AELLT;
                                x.DOMAIN = 'AE';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'AE_Treatments'));
                            jsonFileArray.push(new createJsonDataFile(result, 'AE_Treatments'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient medical history data */

                dataPromises.push(knex('MEDICAL_HISTORY')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'RELATIONS.value as SREL', 'CONDITIONS.value as MHTERM',
                        'MEDICAL_HISTORY.startDate as MHSTDTC', 'MEDICAL_HISTORY.outcome as MHENRTPT', 'MEDICAL_HISTORY.resolvedYear as MHENDTC')
                    .leftOuterJoin('RELATIONS', 'RELATIONS.id', 'MEDICAL_HISTORY.relation')
                    .leftOuterJoin('CONDITIONS', 'CONDITIONS.id', 'MEDICAL_HISTORY.conditionName')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('MEDICAL_HISTORY.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            let convertedResult = [];
                            for (let i = 0; i < result.length; i++) {
                                let entry = Object.assign(result[i]);
                                entry.DOMAIN = 'MH';
                                convertedResult.push(entry);
                            }
                            csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_Relations'));
                            jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_Relations'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient immunisation data */

                dataPromises.push(knex('PATIENTS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_IMMUNISATION.vaccineName as MHTERM', 'PATIENT_IMMUNISATION.immunisationDate as MHSTDTC')
                    .leftOuterJoin('PATIENT_IMMUNISATION', 'PATIENT_IMMUNISATION.id', 'PATIENTS.id')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('PATIENT_IMMUNISATION.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            let convertedResult = [];
                            for (let i = 0; i < result.length; i++) {
                                let entry = Object.assign(result[i]);
                                entry.DOMAIN = 'MH';
                                convertedResult.push(entry);
                            }
                            csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_immunisation'));
                            jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_immunisation'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient diagnosis data */

                dataPromises.push(knex('PATIENTS')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_DIAGNOSIS.diagnosisDate as MHSTDTC', 'AVAILABLE_DIAGNOSES.value as MHTERM')
                    .leftOuterJoin('PATIENT_DIAGNOSIS', 'PATIENT_DIAGNOSIS.patient', 'PATIENTS.id')
                    .leftOuterJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('PATIENT_DIAGNOSIS.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            let convertedResult = [];
                            for (let i = 0; i < result.length; i++) {
                                let entry = Object.assign(result[i]);
                                entry.DOMAIN = 'MH';
                                entry.MHCAT = 'PRIMARY DIAGNOSIS';
                                entry.MHSCAT = 'ONSET COURSE';
                                convertedResult.push(entry);
                            }
                            csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_diagnosis'));
                            jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_diagnosis'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient CE data */

                dataPromises.push(knex('CLINICAL_EVENTS')
                    .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_CLINICAL_EVENT_TYPES.name as CETERM',
                        'CLINICAL_EVENTS.dateStartDate as CESTDTC', 'CLINICAL_EVENTS.endDate as CEENDTC',
                        'CLINICAL_EVENTS_DATA.value as CESEV', 'AVAILABLE_FIELDS_CE.id as fieldId',
                        'CLINICAL_EVENTS_DATA.field', 'CLINICAL_EVENTS_DATA.deleted')
                    .leftOuterJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'CLINICAL_EVENTS.type')
                    .leftOuterJoin('CLINICAL_EVENTS_DATA', 'CLINICAL_EVENTS_DATA.clinicalEvent', 'CLINICAL_EVENTS.id')
                    .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
                    .andWhere('CLINICAL_EVENTS.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
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
                            csvFileArray.push(new createCsvDataFile(newResult, 'CE'));
                            jsonFileArray.push(new createJsonDataFile(newResult, 'CE'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient Evoked Potential test data */

                dataPromises.push(knex('TEST_DATA')
                    .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_TESTS.cdiscName as NVTEST',
                        'TEST_DATA.value as NVORRES', 'AVAILABLE_FIELDS_TESTS.unit as NVORRESU', 'AVAILABLE_FIELDS_TESTS.laterality as NVLAT',
                        'ORDERED_TESTS.actualOccurredDate as NVDTC', 'ORDERED_TESTS.expectedOccurDate as VISITDY')
                    .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
                    .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('TEST_DATA.deleted', '-')
                    .andWhere('ORDERED_TESTS.deleted', '-')
                    // add check for deleted visit?
                    .andWhere('ORDERED_TESTS.type', 2)
                    .then(result => {
                        if (result && result.length > 0) {
                            let newResult = [];
                            for (let i = 0; i < result.length; i++) {
                                let entry = Object.assign(result[i]);
                                entry.NVCAT = 'Visual Evoked Potential (VEP)';
                                entry.DOMAIN = 'NV';
                                newResult.push(entry);
                            }
                            csvFileArray.push(new createCsvDataFile(newResult, 'NV'));
                            jsonFileArray.push(new createJsonDataFile(newResult, 'NV'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient Laboratory Test data */

                dataPromises.push(knex('TEST_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.idname as LBTEST', 'TEST_DATA.value as LBORRES',
                        'ORDERED_TESTS.actualOccurredDate as LBDTC')
                    .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('TEST_DATA.deleted', '-')
                    .andWhere('ORDERED_TESTS.deleted', '-')
                    // add check for deleted visits?
                    .andWhere('ORDERED_TESTS.type', 1)
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.LBTESTCD = x.LBTEST; // WILL UPDATE AFTER CONSULTATION
                                x.DOMAIN = 'LB';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'LB'));
                            jsonFileArray.push(new createJsonDataFile(result, 'LB'));
                        }
                        return true;
                    }).catch(() => false));

                /* Lumbar Puncture */

                dataPromises.push(knex('TEST_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.idname as LBTEST', 'TEST_DATA.value as LBORRES',
                        'ORDERED_TESTS.actualOccurredDate as LBDTC')
                    .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('TEST_DATA.deleted', '-')
                    .andWhere('ORDERED_TESTS.deleted', '-')
                    // add check for deleted visits?
                    .andWhere('ORDERED_TESTS.type', 4)
                    .then(result => {
                        if (result && result.length > 0) {
                            let prResultArr = [];
                            result.forEach(x => {
                                x.LBTESTCD = x.LBTEST; // WILL UPDATE AFTER CONSULTATION
                                x.DOMAIN = 'LB';
                                let prResult = {};
                                prResult.DOMAIN = 'PR';
                                prResult.STUDYID = x.STUDYID;
                                prResult.USUBJID = x.USUBJID;
                                prResult.PRDTC = x.LBDTC;
                                prResultArr.push(prResult);
                            });
                            let lbprReuslt = result.concat(prResultArr);
                            csvFileArray.push(new createCsvDataFile(lbprReuslt, 'LBPR'));
                            jsonFileArray.push(new createJsonDataFile(lbprReuslt, 'LBPR'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient MRI data */

                dataPromises.push(knex('TEST_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.idname as MOTEST', 'TEST_DATA.value as MOORRES',
                        'ORDERED_TESTS.actualOccurredDate as MODTC')
                    .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('TEST_DATA.deleted', '-')
                    .andWhere('ORDERED_TESTS.deleted', '-')
                    // add check for deleted visits?
                    .andWhere('ORDERED_TESTS.type', 3)
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.DOMAIN = 'MO';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'MO'));
                            jsonFileArray.push(new createJsonDataFile(result, 'MO'));
                        }
                        return true;
                    }).catch(() => false));

                /* Clinical Event data */

                dataPromises.push(knex('CLINICAL_EVENTS_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_CE.idname as FATEST', 'CLINICAL_EVENTS_DATA.value as FAORRES')
                    .leftOuterJoin('CLINICAL_EVENTS', 'CLINICAL_EVENTS.id', 'CLINICAL_EVENTS_DATA.clinicalEvent')
                    .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.DOMAIN = 'FA';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'FA'));
                            jsonFileArray.push(new createJsonDataFile(result, 'FA'));
                        }
                        return true;
                    }).catch(() => false));

                /* Patient Symptoms and Signs at Visits */

                dataPromises.push(knex('VISIT_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as CETERM', 'VISIT_DATA.value as CEOCCUR', 'VISITS.visitDate as CEDTC')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
                    .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere(function () {
                        this.whereIn('AVAILABLE_FIELDS_VISITS.section', [2, 3]);
                    })
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('VISIT_DATA.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.DOMAIN = 'CE';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'CE_symptomsSigns'));
                            jsonFileArray.push(new createJsonDataFile(result, 'CE_symptomsSigns'));
                        }
                        return true;
                    }).catch(() => false));

                /* Performance Measures Visual Acuity */

                dataPromises.push(knex('VISIT_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as OETEST',
                        'VISIT_DATA.value as OEORRES', 'AVAILABLE_FIELDS_VISITS.laterality as OELAT', 'VISITS.visitDate as OEDTC')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
                    .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('VISIT_DATA.deleted', '-')
                    .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
                    .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'VisualAcuity')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.OELOC = 'EYE';
                                x.DOMAIN = 'OE';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'OE'));
                            jsonFileArray.push(new createJsonDataFile(result, 'OE'));
                        }
                        return true;
                    }).catch(() => false));

                /* Performance Measures Questionnaires */

                dataPromises.push(knex('VISIT_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as QSTEST',
                        'VISIT_DATA.value as QSORRES', 'VISITS.visitDate as QSDTC')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
                    .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('VISIT_DATA.deleted', '-')
                    .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
                    .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'QS')
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.QSSTRESN = x.QSORRES;
                                x.DOMAIN = 'QS';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'QS'));
                            jsonFileArray.push(new createJsonDataFile(result, 'QS'));
                        }
                        return true;
                    }).catch(() => false));

                /* Performance Measures Functional Tests */

                dataPromises.push(knex('VISIT_DATA')
                    .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as FTTEST',
                        'VISIT_DATA.value as FTORRES', 'VISITS.visitDate as FTDTC')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
                    .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('VISIT_DATA.deleted', '-')
                    .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'FT')
                    .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
                    .then(result => {
                        if (result && result.length > 0) {
                            result.forEach(x => {
                                x.FTSTRESN = x.FTORRES;
                                x.DOMAIN = 'FT';
                            });
                            csvFileArray.push(new createCsvDataFile(result, 'FT'));
                            jsonFileArray.push(new createJsonDataFile(result, 'FT'));

                        }
                        return true;
                    }).catch(() => false));

                /* Patient treatment data- Domain EC may be more appropriate */

                dataPromises.push(knex('TREATMENTS')
                    .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_DRUGS.name as EXTRT',
                        'AVAILABLE_DRUGS.module as EXCLAS', 'TREATMENTS.dose as EXDOSE', 'TREATMENTS.unit as EXDOSU', 'TREATMENTS.startDate as EXSTDTC',
                        'TREATMENTS.times', 'TREATMENTS.intervalUnit', 'TREATMENTS.form as EXROUTE', 'TREATMENTS_INTERRUPTIONS.startDate as EXSTDTC_2',
                        'TREATMENTS.terminatedDate as EXENDTC', 'TREATMENTS.terminatedReason',
                        'TREATMENTS_INTERRUPTIONS.endDate as EXENDTC_2', 'REASONS.value as REASON',
                        'ADVERSE_EVENT_MEDDRA.name as MEDDRA')
                    .leftOuterJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
                    .leftOuterJoin('TREATMENTS_INTERRUPTIONS', 'TREATMENTS_INTERRUPTIONS.treatment', 'TREATMENTS.id')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
                    .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .leftOuterJoin('REASONS', 'REASONS.id', 'TREATMENTS_INTERRUPTIONS.reason')
                    .whereIn('PATIENTS.id', patientArr)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENTS.consent', true)
                    .andWhere('TREATMENTS.deleted', '-')
                    .then(result => {
                        if (result && result.length > 0) {
                            let convertedResult = [];
                            for (let i = 0; i < result.length; i++) {
                                let entry = Object.assign(result[i]);
                                entry.DOMAIN = 'EX';
                                if (entry.times && entry.intervalUnit)
                                    entry.EXDOSFRQ = entry.times.concat(entry.intervalUnit);
                                convertedResult.push(entry);
                            }
                            csvFileArray.push(new createCsvDataFile(convertedResult, 'EX'));
                            jsonFileArray.push(new createJsonDataFile(convertedResult, 'EX'));
                        }
                        return true;
                    }).catch(() => false));

                Promise.all(dataPromises).then(() => {
                    let fileArray = csvFileArray.concat(jsonFileArray);
                    zipFiles(fileArray);
                    return true;
                }).catch(() => false);

            } else {
                noDataArr.push(new createNoDataFile(message.userError.NODATAAVAILABLE, 'noData'));
                res.status(404).zip(noDataArr);
                return false;
            }
            return true;
        }).catch((error) => {
            noDataArr.push(new createNoDataFile(message.errorMessages.NOTFOUND.concat(` ${error}`), 'notFound'));
            res.status(404).zip(noDataArr);
            return false;
        });

        function createNoDataFile(errorMessage, prefix) {

            const noDataFile = `${prefix}${Date.now()}optimise.txt`;
            // check if dir temp exists
            const dir = './temp/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let tempSavedPath = `${dir}${noDataFile}`;
            tempSavedPath = path.normalize(tempSavedPath);
            fs.writeFile(tempSavedPath, errorMessage, err => {
                if (err) {
                    return;
                }
            });
            return { path: tempSavedPath, name: noDataFile };

        }

    }
}

module.exports = ExportDataController;
