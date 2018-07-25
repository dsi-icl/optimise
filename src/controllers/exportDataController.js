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
                    fileArray.push(new createDataFile(result, 'SC_smoking'));
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
                    fileArray.push(new createDataFile(result, 'SU_alcoholConsumption'));
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
                    fileArray.push(new createDataFile(convertedResult, 'MH_Pregnancy'));
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
                    fileArray.push(new createDataFile(result, 'VS'));
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
                    fileArray.push(new createDataFile(result, 'AE_Pregnancy'));
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
                    fileArray.push(new createDataFile(result, 'AE_ClinicalEvents'));
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
                    fileArray.push(new createDataFile(result, 'AE_Treatments'));
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
                    fileArray.push(new createDataFile(convertedResult, 'MH_Relations'));
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
                    fileArray.push(new createDataFile(convertedResult, 'MH_immunisation'));
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
                    fileArray.push(new createDataFile(newResult, 'NV'));
                }
            });

        /* Patient Laboratory Test data */

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
                    result.forEach(x => {
                        x.DOMAIN = 'LB';
                    });
                    fileArray.push(new createDataFile(result, 'LB'));
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
                    fileArray.push(new createDataFile(result, 'CE_symptomsSigns'));
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
                    fileArray.push(new createDataFile(result, 'OE'));
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
                    fileArray.push(new createDataFile(result, 'QS'));
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
                    fileArray.push(new createDataFile(result, 'FT'));
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
