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

        let isCDISC = query.cdisc !== undefined;
        let queryfield = '';
        let queryvalue = '';
        let attachementName = `optimise_export_${Date.now()}`;

        if (typeof query.field === 'string')
            queryfield = query.field;
        else if (query.field !== undefined)
            return res.status(400).zip([ExportDataController.createErrorFile(message.userError.INVALIDQUERY)], attachementName);

        if (typeof query.value === 'string')
            queryvalue = query.value;
        else if (query.value !== undefined)
            return res.status(400).zip([ExportDataController.createErrorFile(message.userError.INVALIDQUERY)], attachementName);

        let extractor = 'getPatientData';
        if (isCDISC === true) {
            extractor = 'getPatientDataCDISC';
            attachementName += '_cdisc';
        }

        searchEntry(queryfield, queryvalue) .then(result => result && result.length !== undefined ? result.filter(({ consent }) => consent === true) : [])
            .then(result => result.length > 0 ? ExportDataController[extractor](result.map(({ patientId }) => patientId)) : ExportDataController.createNoDataFile())
            .then(matrixResults => matrixResults.length !== undefined ? matrixResults.reduce((a, dr) => dr[1][0] !== undefined ? [...a, ExportDataController.createJsonDataFile(dr), ExportDataController.createCsvDataFile(dr)] : a, []) : [ExportDataController.createNoDataFile()])
            .then(filesArray => res.status(200).zip(filesArray, `${attachementName}.zip`))
            .catch(error => res.status(404).zip([ExportDataController.createErrorFile(message.errorMessages.NOTFOUND.concat(` ${error}`))], `${attachementName}.zip`));
    }

    static async getPatientData(patientList) {
        const data = [];
        let globalLineCount = 1;

        const unwindEntries = tree => {
            const largestChildNum = Math.max(tree.comorbidities.length, tree.labs.length, tree.mri.length, tree.SAEs.length, tree.treatments.length, tree.relapses.length, tree.pregnancies.length);
            const lines = [];
            let i = 0;
            do {
                lines.push({
                    lineNum: globalLineCount++,
                    subjid: i === 0 ? tree.subjid : '',
                    alias: i === 0 ? tree.aliasId : '',
                    visit_id: i === 0 ? tree.visit_id : '',
                    visit_date: i === 0 ? tree.visit_date : '',
                    reason_for_visit: i === 0 ? tree.reason_for_visit : '',
                    vitals_sbp: i === 0 ? tree.vitals_sbp : '',
                    vitals_dbp: i === 0 ? tree.vitals_dbp : '',
                    heart_rate: i === 0 ? tree.heart_rate : '',
                    habits_alcohol: i === 0 ? tree.habits_alcohol : '',
                    habits_smoking: i === 0 ? tree.habits_smoking : '',
                    comorbid_recorded_during_visit_code: '',
                    comorbid_recorded_during_visit_name: '',
                    EDSS_score: i === 0 ? tree.EDSS_score : '',
                    pregnancy_start_date: '',
                    pregnancy_end_date: '',
                    pregnancy_outcome: '',
                    DMT_name: '',
                    DMT_dose: '',
                    DMT_freq: '',
                    DMT_start_date: '',
                    DMT_end_date: '',
                    relapse_type: '',
                    relapse_start_date: '',
                    relapse_severity: '',
                    relapse_end_date: '',
                    relapse_recovery: '',
                    SAE_type: '',
                    SAE_start_date: '',
                    SAE_end_date: '',
                    SAE_note: '',
                    lab_test_id: '',
                    lab_test_name: '',
                    lab_test_value: '',
                    lab_test_date: '',
                    mri_id: '',
                    mri_result_name: '',
                    mri_result_value: '',
                    mri_date: '',
                    ...(tree.pregnancies[i] || {}),
                    ...(tree.treatments[i] || {}),
                    ...(tree.relapses[i] || {}),
                    ...(tree.SAEs[i] || {}),
                    ...(tree.labs[i] || {}),
                    ...(tree.comorbidities[i] || {}),
                    ...(tree.mri[i] || {}),
                });
                i++;
            } while (i < largestChildNum);
            return lines;
        };

        /* transform test from sql to csv */
        const fetchAssociatedDataForTestandTransform = async data => {
            let entry;
            const associatedData = await dbcon()('TEST_DATA')
                .select('TEST_DATA.value as value', 'AVAILABLE_FIELDS_TESTS.definition as definition')
                .leftJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
                .where('TEST_DATA.deleted', '-')
                .where('TEST_DATA.test', data.id);
            switch (data.type) {
                case 1: // lab test
                    entry = associatedData.map(e => ({
                        lab_test_id: data.id,
                        lab_test_name: e.definition,
                        lab_test_value: e.value,
                        lab_test_date: (data.actualOccurredDate && new Date(data.actualOccurredDate).toDateString()) || ''
                    }));
                    break;
                case 3: // MRI
                    entry = associatedData.map(e => ({
                        mri_id: data.id,
                        mri_result_name: e.definition,
                        mri_result_value: e.value,
                        mri_date: (data.actualOccurredDate && new Date(data.actualOccurredDate).toDateString()) || ''
                    }));
                    break;
                default:
                    return null;
            }
            return entry;
        };

        /* transform ce from sql to csv */
        const fetchAssociatedDataForCEandTransform = async data => {
            let entry;
            let typeMap;
            const associatedData = await dbcon()('CLINICAL_EVENTS_DATA').select('*').where('deleted', '-').where('clinicalEvent', data.id);
            switch (data.type) {
                case 1: // relapse
                    entry = {
                        relapse_type: associatedData.filter(e => [1,2,3,4,5,6,7].includes(e.field)).reduce((a, e) => `${a}${`_${e.definition}`}`, ''),
                        relapse_start_date: (data.dateStartDate && new Date(parseInt(data.dateStartDate)).toDateString()) || '',
                        relapse_severity: associatedData.filter(e => e.field === 9).reduce((a, e) => `${a}${`_${e.value}`}`, ''),
                        relapse_end_date: (data.endDate && new Date(parseInt(data.endDate)).toDateString()) || '',
                        relapse_recovery: associatedData.filter(e => e.field === 10).reduce((a, e) => `${a}${`_${e.value}`}`, '')
                    };
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    typeMap = { 2: 'Infection', 3: 'Opportunistic infection', 4: 'Death', 5: 'SAE-treatment-related', 6: 'Other SAEs' };
                    entry = {
                        SAE_type: typeMap[data.type],
                        SAE_start_date: (data.dateStartDate && new Date(parseInt(data.dateStartDate)).toDateString()) || '',
                        SAE_end_date: (data.endDate && new Date(parseInt(data.endDate)).toDateString()) || '',
                        SAE_note: associatedData.reduce((a, e) => `${a}|${e.field}: ${e.value}`, '')
                    };
                    break;
            }
            return entry;
        };

        /* visits */
        let visits = await dbcon()('VISITS')
            .select('VISITS.id as visitId', 'PATIENTS.id as patientId', 'PATIENTS.aliasId as patientAlias', 'VISITS.id as visitId', 'VISITS.visitDate', 'VISITS.type as visitType', 'VISITS.deleted as visitDeleted', 'PATIENTS.deleted as patientDeleted')
            .leftJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENTS.deleted', '-')
            .andWhere('VISITS.deleted', '-')
            .andWhere('PATIENTS.consent', 1);

        /* creating a object containing { [patientId: string]: visitId[] } for later */
        const patientToVisitsMap = visits.reduce((a, e) => {
            if (a[e.patientId] === undefined) {
                a[e.patientId] = [];
            }
            a[e.patientId].push(e.visitId);
            return a;
        }, {});

        /* filter out the shadow visits */
        visits = visits.filter(e => e.visitType === 1);

        /* sort visit by patientId and date */
        visits.sort((a, b) => parseInt(a.patientId) - parseInt(b.patientId) || parseInt(a.visitDate) - parseInt(b.visitDate));

        /* get the data needed for each visit */
        let lastVisitPatient;
        let lastVisitDate;
        for (let visit of visits) {
            /* if last visit is for another patient then reset */
            if (lastVisitPatient !== visit.patientId){
                lastVisitDate = Number.MIN_SAFE_INTEGER;
                lastVisitPatient = visit.patientId;
            }

            const thisVisitDate = parseInt(visit.visitDate);

            /* data for this visit */
            const visitData = await dbcon()('VISIT_DATA')
                .select('*')
                .whereIn('field', [0, 1, 2, 3, 252, 253, 121]) // 0 = reason for visit, 1 = systolic blood pressure, 2 = diastolic blood pressure, 3 = heart rate, 252 = smoke, 253 = alcohol, 121 = estimated EDSS
                .where('visit', visit.visitId)
                .where('deleted', '-');
            const visitDataTransformed = visitData.reduce((a, e) => { a[e.field] = e.value; return a; }, {});

            /* pregnancy for this visit */
            const pregnancy = await dbcon()('PATIENT_PREGNANCY')
                .select('PREGNANCY_OUTCOMES.value as outcome', 'PATIENT_PREGNANCY.startDate as startDate', 'PATIENT_PREGNANCY.outcomeDate as outcomeDate')
                .leftOuterJoin('PREGNANCY_OUTCOMES', 'PREGNANCY_OUTCOMES.id', 'PATIENT_PREGNANCY.outcome')
                .whereBetween(dbcon().raw('CAST(PATIENT_PREGNANCY.startDate as integer)'), [lastVisitDate, thisVisitDate])
                .andWhere('PATIENT_PREGNANCY.deleted', '-')
                .andWhere('PATIENT_PREGNANCY.patient', visit.patientId);
            const pregnancy_transformed = pregnancy.map(e => ({
                pregnancy_start_date: new Date(parseInt(e.startDate)).toDateString(),
                pregnancy_end_date: (e.outcomeDate && new Date(parseInt(e.outcomeDate)).toDateString()) || '',
                pregnancy_outcome: e.outcome
            }));

            const treatments = await dbcon()('TREATMENTS')
                .select('AVAILABLE_DRUGS.name as drug', 'TREATMENTS.dose as dose', 'TREATMENTS.unit as unit', 'TREATMENTS.times as times', 'TREATMENTS.intervalUnit as intervalUnit', 'TREATMENTS.startDate as startDate', 'TREATMENTS.terminatedDate as terminatedDate')
                .leftOuterJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
                .whereBetween(dbcon().raw('CAST(TREATMENTS.startDate as integer)'), [lastVisitDate, thisVisitDate])
                .andWhere('TREATMENTS.deleted', '-')
                .whereIn('TREATMENTS.orderedDuringVisit', patientToVisitsMap[visit.patientId]);
            const treatment_transformed = treatments.map(e => ({
                DMT_name: e.drug,
                DMT_dose: e.dose ? `${e.dose} ${e.unit || ''}` : '',
                DMT_freq: e.times && e.intervalUnit ? `${e.times} ${e.intervalUnit}` : '',
                DMT_start_date: new Date(parseInt(e.startDate)).toDateString(),
                DMT_end_date: (e.terminatedDate && new Date(parseInt(e.terminatedDate)).toDateString()) || ''
            }));

            const all_ce = await dbcon()('CLINICAL_EVENTS')
                .select('*')
                .whereBetween(dbcon().raw('CAST(dateStartDate as integer)'), [lastVisitDate, thisVisitDate])
                .andWhere('deleted', '-')
                .whereIn('recordedDuringVisit', patientToVisitsMap[visit.patientId]);
            /* type 1 = relapse, 2 = infection, 3 = opportunisitic infection, 4 = Death, 5 = SAE realted to treatment , 6 = other SAE*/
            const all_ce_grouped = {};
            for (let e of all_ce) {
                if (all_ce_grouped[e.type] === undefined){
                    all_ce_grouped[e.type] = [];
                }
                const entry = await fetchAssociatedDataForCEandTransform(e);
                all_ce_grouped[e.type].push(entry);
            }

            const MRI_and_lab = await dbcon()('ORDERED_TESTS')
                .select('*')
                .whereBetween(dbcon().raw('CAST(actualOccurredDate as integer)'), [lastVisitDate, thisVisitDate])
                .andWhere('deleted', '-')
                .whereIn('type', [1,3])
                .whereIn('orderedDuringVisit', patientToVisitsMap[visit.patientId]);
            const tests_grouped = {};
            for (let e of MRI_and_lab) {
                if (tests_grouped[e.type] === undefined){
                    tests_grouped[e.type] = [];
                }
                const entry = await fetchAssociatedDataForTestandTransform(e);
                tests_grouped[e.type] = tests_grouped[e.type].concat(entry);
            }

            const comorbidities = await dbcon()('COMORBIDITY')
                .select('ICD11.code as comorbid_recorded_during_visit_code', 'ICD11.name as comorbid_recorded_during_visit_name')
                .leftJoin('ICD11', 'ICD11.id', 'COMORBIDITY.comorbidity')
                .where('COMORBIDITY.visit', visit.visitId)
                .andWhere('COMORBIDITY.deleted', '-');

            const csventry = {
                subjid: visit.patientId,
                aliasId: visit.patientAlias,
                visit_id: visit.visitId,
                visit_date: new Date(parseInt(visit.visitDate)).toDateString(),
                reason_for_visit: visitDataTransformed[0] || null,
                vitals_sbp: visitDataTransformed[1] || null,
                vitals_dbp: visitDataTransformed[2] || null,
                heart_rate: visitDataTransformed[3] || null,
                habits_alcohol: visitDataTransformed[253] || null,
                habits_smoking: visitDataTransformed[252] || null,
                EDSS_score: visitDataTransformed[121] || null,
                pregnancies: pregnancy_transformed,
                treatments: treatment_transformed,
                comorbidities,
                relapses: all_ce_grouped[1] || [],
                SAEs: [...(all_ce_grouped[2] || []), ...(all_ce_grouped[3] || []), ...(all_ce_grouped[4] || []), ...(all_ce_grouped[5] || []), ...(all_ce_grouped[6] || [])],
                labs: tests_grouped[1] || [],
                mri: tests_grouped[3] || []
            };

            data.push(csventry);

            lastVisitDate = thisVisitDate;
        }
        data.reverse();
        const unwoundData = data.reduce((a, e) => {
            a = a.concat(unwindEntries(e));
            return a;
        }, []);

        return [['SHORT_VISIT_SUMMARY', unwoundData]];
    }

    static getPatientDataCDISC(patientList) {

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

        // Returning all domains as separate promise on matrix
        return Promise.all(dataPromises);
    }
}

export default ExportDataController;
