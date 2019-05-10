/* Export data for all patients */

import dbcon from '../utils/db-connection';

import message from '../utils/message-utils';
import { searchEntry } from '../utils/controller-utils';
import fs from 'fs';
import path from 'path';
require('express-zip');

class ExportDataController {

    static createFile(filename, content) {

        if (!fs.existsSync(global.config.exportGenerationFolder)) {
            fs.mkdirSync(global.config.exportGenerationFolder);
        }

        let filepath = path.normalize(`${global.config.exportGenerationFolder}${filename}.${Date.now()}`);
        fs.writeFileSync(filepath, content);

        return {
            path: filepath,
            name: filename
        };
    }

    static createErrorFile(errorMessage) {

        return ExportDataController.createFile('error.txt', errorMessage);

    }

    static createNoDataFile() {

        return ExportDataController.createFile('noData.txt', message.userError.NODATAAVAILABLE);

    }

    static createCsvDataFile(result) {

        const fileName = `${result[0]}.csv`;
        let keys = Object.keys(result[1][0]);
        let tempResult = `${keys.join(',')}\n`;
        result[1].forEach((obj) => {
            keys.forEach((a, b) => {
                if (b) tempResult += ',';
                tempResult += obj[a];
            });
            tempResult += '\n';
        });
        const fileContents = Buffer.from(tempResult);
        return ExportDataController.createFile(fileName, fileContents);
    }

    static createJsonDataFile(result) {

        const fileName = `${result[0]}.json`;
        const fileContents = Buffer.from(JSON.stringify(result[1]));
        return ExportDataController.createFile(fileName, fileContents);

    }

    static exportDatabase({ query }, res) {

        let isPatientMappings = query.patientMappings !== undefined;
        let queryfield = '';
        let queryvalue = '';
        let attachementName = `optimise_export_${Date.now()}`;

        if (isPatientMappings === true) {
            attachementName += '_patientMappings';
            searchEntry(queryfield, queryvalue)
                .then(result => result && result.length !== undefined ? result.filter(({ consent }) => consent === true) : [])
                .then(result => result.length > 0 ? result.map(({ uuid, aliasId }) => ({ optimiseID: uuid, patientId: aliasId })) : ExportDataController.createNoDataFile())
                .then(result => result.length !== undefined ? [ExportDataController.createJsonDataFile(['patientMappings',result]), ExportDataController.createCsvDataFile(['patientMappings',result])] : [result])
                .then(filesArray => res.status(200).zip(filesArray), `${attachementName}.zip`)
                .catch(error => res.status(404).zip([ExportDataController.createErrorFile(message.errorMessages.NOTFOUND.concat(` ${error}`))], `${attachementName}.zip`));
        } else {
            if (typeof query.field === 'string')
                queryfield = query.field;
            else if (query.field !== undefined)
                return res.status(400).zip([ExportDataController.createErrorFile(message.userError.INVALIDQUERY)], `${attachementName}.zip`);

            if (typeof query.value === 'string')
                queryvalue = query.value;
            else if (query.value !== undefined)
                return res.status(400).zip([ExportDataController.createErrorFile(message.userError.INVALIDQUERY)], `${attachementName}.zip`);

            searchEntry(queryfield, queryvalue)
                .then(result => result && result.length !== undefined ? result.filter(({ consent }) => consent === true) : [])
                .then(result => result.length > 0 ? ExportDataController.getPatientData(result.map(({ patientId }) => patientId)) : ExportDataController.createNoDataFile())
                .then(domainResults => domainResults.length !== undefined ? domainResults.reduce((a, dr) => dr[1][0] !== undefined ? [...a, ExportDataController.createJsonDataFile(dr), ExportDataController.createCsvDataFile(dr)] : a, []) : [domainResults])
                .then(filesArray => res.status(200).zip(filesArray), `${attachementName}.zip`)
                .catch(error => res.status(404).zip([ExportDataController.createErrorFile(message.errorMessages.NOTFOUND.concat(` ${error}`))], `${attachementName}.zip`));
        }
    }

    static getPatientData(patientList) {

        let dataPromises = [];

        /* Patient demographic data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_DEMOGRAPHIC.DOB as BRTHDTC', 'GENDERS.value as SEX',
                'DOMINANT_HANDS.value as DOMINANT', 'ETHNICITIES.value as ETHNIC', 'COUNTRIES.value as COUNTRY')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .leftOuterJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
            .leftOuterJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
            .leftOuterJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
            .leftOuterJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => ['DM', result.map(x => ({
                ...x,
                DOMAIN: 'DM'
            }))]));

        // /* Smoking history data */
        // dataPromises.push(dbcon()('PATIENTS')
        //     .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'SMOKING_HISTORY.value as SCORRES')
        //     .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
        //     .leftOuterJoin('SMOKING_HISTORY', 'SMOKING_HISTORY.id', 'PATIENT_DEMOGRAPHIC.smokingHistory')
        //     .whereIn('PATIENTS.id', patientList)
        //     .andWhere('PATIENTS.deleted', '-')
        //     .andWhere('PATIENTS.consent', true)
        //     .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
        //     .then(result => ['SC_Smoking', result.map(x => ({
        //         ...x,
        //         DOMAIN: 'SC'
        //     }))]));

        // /* Alcohol consumption data */
        // dataPromises.push(dbcon()('PATIENTS')
        //     .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ALCOHOL_USAGE.value as SUDOSFRQ')
        //     .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
        //     .leftOuterJoin('ALCOHOL_USAGE', 'ALCOHOL_USAGE.id', 'PATIENT_DEMOGRAPHIC.alcoholUsage')
        //     .whereIn('PATIENTS.id', patientList)
        //     .andWhere('PATIENTS.deleted', '-')
        //     .andWhere('PATIENTS.consent', true)
        //     .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
        //     .then(result => ['SU_AlcoholConsumption', result.map(x => ({
        //         ...x,
        //         DOMAIN: 'SU'
        //     }))]));

        /* Patient pregnancy data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_PREGNANCY.startDate as MHSTDTC', 'PREGNANCY_OUTCOMES.value as MHENRTPT',
                'PATIENT_PREGNANCY.outcomeDate as MHENDTC', 'ADVERSE_EVENT_MEDDRA.name as MHDECOD')
            .leftOuterJoin('PATIENT_PREGNANCY', 'PATIENT_PREGNANCY.patient', 'PATIENTS.id')
            .leftJoin('PREGNANCY_OUTCOMES', 'PREGNANCY_OUTCOMES.id', 'PATIENT_PREGNANCY.outcome')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('PATIENT_PREGNANCY.deleted', '-')
            .then(result => ['MH_Pregnancy', result.map(x => ({
                ...x,
                DOMAIN: 'MH',
                MHCAT: 'GENERAL'
            }))]));

        /* Patient vital signs data (within Visit) */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as VSTEST', 'VISIT_DATA.value as VSORRES',
                'AVAILABLE_FIELDS_VISITS.unit as VSORRESU', 'VISITS.visitDate as VSDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('VISITS.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 1)
            .then(result => ['VS', result.map(x => ({
                ...x,
                DOMAIN: 'VS'
            }))]));

        /* Patient Adverse Events data- Pregnancy */
        dataPromises.push(dbcon()('PATIENT_PREGNANCY')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_PREGNANCY.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('PATIENT_PREGNANCY.deleted', '-')
            .then(result => ['AE_Pregnancy', result.map(x => ({
                ...x,
                DOMAIN: 'AE',
                AETERM: x.AELLT
            }))]));

        /* Patient Adverse Events data- Clinical Events */
        dataPromises.push(dbcon()('CLINICAL_EVENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('CLINICAL_EVENTS.deleted', '-')
            .then(result => ['AE_ClinicalEvents', result.map(x => ({
                ...x,
                DOMAIN: 'AE',
                AETERM: x.AELLT
            }))]));

        /* Patient Adverse Events data- Treatment interruptions */
        dataPromises.push(dbcon()('TREATMENTS_INTERRUPTIONS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('TREATMENTS', 'TREATMENTS.id', 'TREATMENTS_INTERRUPTIONS.treatment')
            .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('TREATMENTS_INTERRUPTIONS.deleted', '-')
            .then(result => ['AE_Treatments', result.map(x => ({
                ...x,
                DOMAIN: 'AE',
                AETERM: x.AELLT
            }))]));

        /* Patient medical history data */
        dataPromises.push(dbcon()('MEDICAL_HISTORY')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'RELATIONS.value as SREL', 'CONDITIONS.value as MHTERM',
                'MEDICAL_HISTORY.startDate as MHSTDTC', 'MEDICAL_HISTORY.outcome as MHENRTPT', 'MEDICAL_HISTORY.resolvedYear as MHENDTC')
            .leftOuterJoin('RELATIONS', 'RELATIONS.id', 'MEDICAL_HISTORY.relation')
            .leftOuterJoin('CONDITIONS', 'CONDITIONS.id', 'MEDICAL_HISTORY.conditionName')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('MEDICAL_HISTORY.deleted', '-')
            .then(result => ['MH_Relations', result.map(x => ({
                ...x,
                DOMAIN: 'MH'
            }))]));

        /* Patient immunisation data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_IMMUNISATION.vaccineName as MHTERM', 'PATIENT_IMMUNISATION.immunisationDate as MHSTDTC')
            .leftOuterJoin('PATIENT_IMMUNISATION', 'PATIENT_IMMUNISATION.id', 'PATIENTS.id')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('PATIENT_IMMUNISATION.deleted', '-')
            .then(result => ['MH_Immunisation', result.map(x => ({
                ...x,
                DOMAIN: 'MH'
            }))]));

        /* Patient diagnosis data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'PATIENT_DIAGNOSIS.diagnosisDate as MHSTDTC', 'AVAILABLE_DIAGNOSES.value as MHTERM')
            .leftOuterJoin('PATIENT_DIAGNOSIS', 'PATIENT_DIAGNOSIS.patient', 'PATIENTS.id')
            .leftOuterJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('PATIENT_DIAGNOSIS.deleted', '-')
            .then(result => ['MH_Diagnosis', result.map(x => ({
                ...x,
                DOMAIN: 'MH',
                MHCAT: 'PRIMARY DIAGNOSIS',
                MHSCAT: 'ONSET COURSE'
            }))]));

        /* Patient CE data */
        dataPromises.push(dbcon()('CLINICAL_EVENTS')
            .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_CLINICAL_EVENT_TYPES.name as CETERM',
                'CLINICAL_EVENTS.dateStartDate as CESTDTC', 'CLINICAL_EVENTS.endDate as CEENDTC',
                'CLINICAL_EVENTS_DATA.value as CESEV', 'AVAILABLE_FIELDS_CE.id as fieldId',
                'CLINICAL_EVENTS_DATA.field', 'CLINICAL_EVENTS_DATA.deleted')
            .leftOuterJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'CLINICAL_EVENTS.type')
            .leftOuterJoin('CLINICAL_EVENTS_DATA', 'CLINICAL_EVENTS_DATA.clinicalEvent', 'CLINICAL_EVENTS.id')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
            .andWhere('CLINICAL_EVENTS.deleted', '-')
            .then(result => ['CE', result.map(x => ({
                ...x,
                field: undefined,
                fieldId: undefined,
                deleted: undefined,
                DOMAIN: 'CE',
                CESEV: x.fieldId && x.fieldId !== 9 && x.CESEV ? null : x.CESEV
            }))]));

        /* Patient Evoked Potential test data */
        dataPromises.push(dbcon()('TEST_DATA')
            .select('PATIENTS.study as STUDYID', 'PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_TESTS.cdiscName as NVTEST',
                'TEST_DATA.value as NVORRES', 'AVAILABLE_FIELDS_TESTS.unit as NVORRESU', 'AVAILABLE_FIELDS_TESTS.laterality as NVLAT',
                'ORDERED_TESTS.actualOccurredDate as NVDTC', 'ORDERED_TESTS.expectedOccurDate as VISITDY')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 2)
            .then(result => ['NV', result.map(x => ({
                ...x,
                DOMAIN: 'NV',
                NVCAT: 'Visual Evoked Potential (VEP)'
            }))]));

        /* Patient Laboratory Test data */
        dataPromises.push(dbcon()('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.idname as LBTEST', 'TEST_DATA.value as LBORRES',
                'ORDERED_TESTS.expectedOccurDate as LBDTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 1)
            .then(result => ['LB', result.map(x => ({
                ...x,
                DOMAIN: 'LB',
                LBTESTCD: x.LBTEST
            }))]));

        /* Lumbar Puncture */
        dataPromises.push(dbcon()('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.idname as LBTEST', 'TEST_DATA.value as LBORRES',
                'ORDERED_TESTS.actualOccurredDate as LBDTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 4)
            .then(result => ['LBPR', result.map(x => ({
                ...x,
                DOMAIN: 'LB',
                LBTESTCD: x.LBTEST
            })).concat(result.map(({ STUDYID, USUBJID, LBDTC }) => ({
                DOMAIN: 'PR',
                STUDYID: STUDYID,
                USUBJID: USUBJID,
                PRDTC: LBDTC
            })))]));

        /* Patient MRI data */
        dataPromises.push(dbcon()('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_TESTS.idname as MOTEST', 'TEST_DATA.value as MOORRES',
                'ORDERED_TESTS.actualOccurredDate as MODTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 3)
            .then(result => ['MO', result.map(x => ({
                ...x,
                DOMAIN: 'MO'
            }))]));

        /* Clinical Event data */
        dataPromises.push(dbcon()('CLINICAL_EVENTS_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_CE.idname as FATEST', 'CLINICAL_EVENTS_DATA.value as FAORRES')
            .leftOuterJoin('CLINICAL_EVENTS', 'CLINICAL_EVENTS.id', 'CLINICAL_EVENTS_DATA.clinicalEvent')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
            .then(result => ['FA', result.map(x => ({
                ...x,
                DOMAIN: 'FA'
            }))]));

        /* Patient Symptoms and Signs at Visits */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as CETERM', 'VISIT_DATA.value as CEOCCUR', 'VISITS.visitDate as CEDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere(function () {
                this.whereIn('AVAILABLE_FIELDS_VISITS.section', [2, 3]);
            })
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('VISIT_DATA.deleted', '-')
            .then(result => ['CE_SymptomsSigns', result.map(x => ({
                ...x,
                DOMAIN: 'CE'
            }))]));

        /* Performance Measures Visual Acuity */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as OETEST',
                'VISIT_DATA.value as OEORRES', 'AVAILABLE_FIELDS_VISITS.laterality as OELAT', 'VISITS.visitDate as OEDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'VisualAcuity')
            .then(result => ['OE', result.map(x => ({
                ...x,
                DOMAIN: 'OE',
                OELOC: 'EYE'
            }))]));

        /* Performance Measures Questionnaires */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as QSTEST',
                'VISIT_DATA.value as QSORRES', 'VISITS.visitDate as QSDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'QS')
            .then(result => ['QS', result.map(x => ({
                ...x,
                DOMAIN: 'QS',
                QSSTRESN: x.QSORRES
            }))]));

        /* Performance Measures Functional Tests */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'PATIENTS.study as STUDYID', 'AVAILABLE_FIELDS_VISITS.idname as FTTEST',
                'VISIT_DATA.value as FTORRES', 'VISITS.visitDate as FTDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'FT')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
            .then(result => ['FT', result.map(x => ({
                ...x,
                DOMAIN: 'FT',
                FTSTRESN: x.FTORRES
            }))]));

        /* Patient treatment data- Domain EC may be more appropriate */
        dataPromises.push(dbcon()('TREATMENTS')
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
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('PATIENTS.consent', true)
            .andWhere('TREATMENTS.deleted', '-')
            .then(result => ['EX', result.map(x => ({
                ...x,
                DOMAIN: 'EX',
                EXDOSFRQ: x.times && x.intervalUnit ? `${x.times} ${x.intervalUnit}` : undefined
            }))]));

        return Promise.all(dataPromises);
    }
}

export default ExportDataController;
