/* Export data for all patients */

const knex = require('../utils/db-connection');
const fs = require('fs');
const path = require('path');
require('express-zip');

class ExportDataController {

    exportDatabase(__unused__req, res) {

        const csvFileName = 'optimiseCSV.csv';
        const jsonFileName = 'optimiseJSON.json';
        let csvFileArray = [];
        let jsonFileArray = [];

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
                    csvFileArray.push(new createCsvDataFile(convertedResult, 'DM'));
                    jsonFileArray.push(new createJsonDataFile(convertedResult, 'DM'));
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
                    csvFileArray.push(new createCsvDataFile(result, 'SC_smoking'));
                    jsonFileArray.push(new createJsonDataFile(result, 'SC_smoking'));
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
                    result.forEach(x => {
                        x.DOMAIN = 'SU';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'SU_alcoholConsumption'));
                    jsonFileArray.push(new createJsonDataFile(result, 'SU_alcoholConsumption'));
                }
            });

        /* Patient pregnancy data */

        knex('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID',
                'PATIENT_PREGNANCY.startDate as MHSTDTC',
                'PREGNANCY_OUTCOMES.value as MHENRTPT', 'PATIENT_PREGNANCY.outcomeDate as MHENDTC',
                'ADVERSE_EVENT_MEDDRA.name as MHDECOD')
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
                        entry.MHCAT = 'GENERAL';
                        entry.DOMAIN = 'MH';
                        convertedResult.push(entry);
                    }
                    csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_Pregnancy'));
                    jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_Pregnancy'));
                }
            });

        /* Patient vital signs data (within Visit) */

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
                    result.forEach(x => {
                        x.DOMAIN = 'VS';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'VS'));
                    jsonFileArray.push(new createJsonDataFile(result, 'VS'));
                }
            });

        /* Patient Adverse Events data- Pregnancy */

        knex('PATIENT_PREGNANCY')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_PREGNANCY.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_PREGNANCY.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.AETERM = x.AELLT;
                        x.DOMAIN = 'AE';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'AE_Pregnancy'));
                    jsonFileArray.push(new createJsonDataFile(result, 'AE_Pregnancy'));
                }
            });

        /* Patient Adverse Events data- Clinical Events */

        knex('CLINICAL_EVENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
            .where('PATIENTS.deleted', '-')
            .andWhere('CLINICAL_EVENTS.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.AETERM = x.AELLT;
                        x.DOMAIN = 'AE';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'AE_ClinicalEvents'));
                    jsonFileArray.push(new createJsonDataFile(result, 'AE_ClinicalEvents'));
                }
            });

        /* Patient Adverse Events data- Treatment interruptions */

        knex('TREATMENTS_INTERRUPTIONS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('TREATMENTS', 'TREATMENTS.id', 'TREATMENTS_INTERRUPTIONS.treatment')
            .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
            .where('PATIENTS.deleted', '-')
            .andWhere('TREATMENTS_INTERRUPTIONS.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.AETERM = x.AELLT;
                        x.DOMAIN = 'AE';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'AE_Treatments'));
                    jsonFileArray.push(new createJsonDataFile(result, 'AE_Treatments'));
                }
            });

        /* Patient medical history data */

        knex('MEDICAL_HISTORY')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'RELATIONS.value as SREL',
                'CONDITIONS.value as MHTERM', 'MEDICAL_HISTORY.startDate as MHSTDTC', 'MEDICAL_HISTORY.outcome as MHENRTPT',
                'MEDICAL_HISTORY.resolvedYear as MHENDTC')
            .leftOuterJoin('RELATIONS', 'RELATIONS.id', 'MEDICAL_HISTORY.relation')
            .leftOuterJoin('CONDITIONS', 'CONDITIONS.id', 'MEDICAL_HISTORY.conditionName')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
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
                    csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_Relations'));
                    jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_Relations'));
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
                    csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_immunisation'));
                    jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_immunisation'));
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
                    csvFileArray.push(new createCsvDataFile(convertedResult, 'MH_diagnosis'));
                    jsonFileArray.push(new createJsonDataFile(convertedResult, 'MH_diagnosis'));
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
                    csvFileArray.push(new createCsvDataFile(newResult, 'CE'));
                    jsonFileArray.push(new createJsonDataFile(newResult, 'CE'));
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
                        entry.NVCAT = 'Visual Evoked Potential (VEP)';
                        entry.DOMAIN = 'NV';
                        newResult.push(entry);
                    }
                    csvFileArray.push(new createCsvDataFile(newResult, 'NV'));
                    jsonFileArray.push(new createJsonDataFile(newResult, 'NV'));
                }
            });

        /* Patient Laboratory Test data */

        knex('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.definition as LBTEST', 'TEST_DATA.value as LBORRES',
                'ORDERED_TESTS.actualOccurredDate as LBDTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .where('PATIENTS.deleted', '-')
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.id', 1)
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.LBTESTCD = x.LBTEST; // WILL UPDATE AFTER CONSULTATION
                        x.DOMAIN = 'LB';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'LB'));
                    jsonFileArray.push(new createJsonDataFile(result, 'LB'));
                }
            });

        /* Lumbar Puncture */

        knex('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.definition as LBTEST', 'TEST_DATA.value as LBORRES',
                'ORDERED_TESTS.actualOccurredDate as LBDTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .where('PATIENTS.deleted', '-')
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.id', 4)
            .then(result => {
                if (result.length >= 1) {
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
                    csvFileArray.push(new createCsvDataFile(result, 'LB'));
                    jsonFileArray.push(new createJsonDataFile(prResultArr, 'PR'));
                }
            });

        /* Patient MRI data */

        knex('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.definition as MOTEST', 'TEST_DATA.value as MOORRES',
                'ORDERED_TESTS.actualOccurredDate as MODTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .where('PATIENTS.deleted', '-')
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.id', 3)
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.DOMAIN = 'MO';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'MO'));
                    jsonFileArray.push(new createJsonDataFile(result, 'MO'));
                }
            });

        /* Clinical Event data */

        knex('CLINICAL_EVENTS_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_CE.definition as FATEST', 'CLINICAL_EVENTS_DATA.value as FAORRES')
            .leftOuterJoin('CLINICAL_EVENTS', 'CLINICAL_EVENTS.id', 'CLINICAL_EVENTS_DATA.clinicalEvent')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.DOMAIN = 'FA';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'FA'));
                    jsonFileArray.push(new createJsonDataFile(result, 'FA'));
                }
            });

        /* Patient Symptoms and Signs at Visits */

        knex('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.definition as CETERM',
                'VISIT_DATA.value as CEOCCUR', 'VISITS.visitDate as CEDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('AVAILABLE_FIELDS_VISITS.section', [2,3])
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('VISIT_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.DOMAIN = 'CE';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'CE_symptomsSigns'));
                    jsonFileArray.push(new createJsonDataFile(result, 'CE_symptomsSigns'));
                }
            });

        /* Performance Measures Visual Acuity */

        knex('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.definition as OETEST',
                'VISIT_DATA.value as OEORRES', 'AVAILABLE_FIELDS_VISITS.laterality as OELAT', 'VISITS.visitDate as OEDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('AVAILABLE_FIELDS_VISITS.section', 4)
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'VisualAcuity')
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('VISIT_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.OELOC = 'EYE';
                        x.DOMAIN = 'OE';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'OE'));
                    jsonFileArray.push(new createJsonDataFile(result, 'OE'));
                }
            });

        /* Performance Measures Questionnaires */

        knex('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.definition as QSTEST',
                'VISIT_DATA.value as QSORRES', 'VISITS.visitDate as QSDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('AVAILABLE_FIELDS_VISITS.section', 4)
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'QS')
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('VISIT_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.QSSTRESN = x.QSORRES;
                        x.DOMAIN = 'QS';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'QS'));
                    jsonFileArray.push(new createJsonDataFile(result, 'QS'));
                }
            });

        /* Performance Measures Functional Tests */

        knex('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.definition as FTTEST',
                'VISIT_DATA.value as FTORRES', 'VISITS.visitDate as FTDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('AVAILABLE_FIELDS_VISITS.section', 4)
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'FT')
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('VISIT_DATA.deleted', '-')
            .then(result => {
                if (result.length >= 1) {
                    result.forEach(x => {
                        x.FTSTRESN = x.FTORRES;
                        x.DOMAIN = 'FT';
                    });
                    csvFileArray.push(new createCsvDataFile(result, 'FT'));
                    jsonFileArray.push(new createJsonDataFile(result, 'EX'));

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
                    csvFileArray.push(new createCsvDataFile(convertedResult, 'EX'));
                    jsonFileArray.push(new createCsvDataFile(convertedResult, 'EX'));
                }
                let fileArray = csvFileArray.concat(jsonFileArray);
                zipFiles(fileArray);
            });

        /* function to create a json file */

        function createJsonDataFile(result, prefix) {

            const tempJsonFileName = `${prefix}${jsonFileName}`;
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

            const tempCsvFileName = `${prefix}${csvFileName}`;
            let keys = Object.keys(result[0]); // get the keys from result to create headers
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
            if (arr.length >= 1) {
                res.status(200).zip(arr);
            } else {
                res.status(204).send('There are no patient entries in the database.');
            }
        }
    }
}

module.exports = ExportDataController;
