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

        const filepath = path.normalize(`${global.config.exportGenerationFolder}${filename}.${Date.now()}`);
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
        const keys = Object.keys(result[1][0]);
        let tempResult = `${keys.join(',')}\n`;
        result[1].forEach((obj) => {
            keys.forEach((a, b) => {
                if (b) tempResult += ',';
                tempResult += obj[a] === undefined ? '' : obj[a];
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

        const isPatientMappings = query.patientMappings !== undefined;
        const isCDISC = query.cdisc !== undefined;
        let queryfield = '';
        let queryvalue = '';
        let attachmentName = `optimise_export_${Date.now()}`;

        if (isPatientMappings === true) {
            attachmentName += '_patientMappings';
            searchEntry(queryfield, queryvalue)
                .then(result => result && result.length !== undefined ? result : [])
                .then(result => result.length > 0 ? result.map(({ uuid, aliasId }) => ({ optimiseID: uuid, patientId: aliasId })) : ExportDataController.createNoDataFile())
                .then(result => result.length !== undefined ? [ExportDataController.createJsonDataFile(['patientMappings', result]), ExportDataController.createCsvDataFile(['patientMappings', result])] : [result])
                .then(filesArray => res.status(200).zip(filesArray, `${attachmentName}.zip`))
                .catch(error => res.status(404).zip([ExportDataController.createErrorFile(message.errorMessages.NOTFOUND.concat(` ${error}`))], `${attachmentName}.zip`));
        } else {
            if (typeof query.field === 'string')
                queryfield = query.field;
            else if (query.field !== undefined)
                return res.status(400).zip([ExportDataController.createErrorFile(message.userError.INVALIDQUERY)], `${attachmentName}.zip`);

            if (typeof query.value === 'string')
                queryvalue = query.value;
            else if (query.value !== undefined)
                return res.status(400).zip([ExportDataController.createErrorFile(message.userError.INVALIDQUERY)], `${attachmentName}.zip`);

            let extractor = 'getPatientData';
            if (isCDISC === true) {
                extractor = 'getPatientDataCDISC';
                attachmentName += '_cdisc';
            }

            searchEntry(queryfield, queryvalue)
                .then(result => result && result.length !== undefined ? result : [])
                .then(result => result.length > 0 ? ExportDataController[extractor](result.map(({ patientId }) => patientId)) : ExportDataController.createNoDataFile())
                .then(matrixResults => matrixResults.length !== undefined ? matrixResults.reduce((a, dr) => dr[1][0] !== undefined ? [...a, ExportDataController.createJsonDataFile(dr), ExportDataController.createCsvDataFile(dr)] : a, []) : [ExportDataController.createNoDataFile()])
                .then(matrixResults => matrixResults.length !== 0 ? matrixResults : [ExportDataController.createNoDataFile()])
                .then(filesArray => res.status(200).zip(filesArray, `${attachmentName}.zip`))
                .catch(error => res.status(404).zip([ExportDataController.createErrorFile(message.errorMessages.NOTFOUND.concat(` ${error}`))], `${attachmentName}.zip`));

        }
    }

    static intervalUnitString(intervalUnit) {
        if (intervalUnit === '6weeks')
            return '6 weeks';
        else if (intervalUnit === '8weeks')
            return '8 weeks';
        else
            return intervalUnit;
    }

    static async getPatientData(patientList) {
        const data = [];
        let globalLineCount = 1;
        let globalMaxComorbidities = 1;
        let globalMaxLabs = 1;
        let globalMaxPregnancies = 1;
        let globalMaxMRIs = 1;
        let globalMaxSAEs = 1;
        let globalMaxTreatments = 1;
        let globalMaxRelapses = 1;
        const globalMaxDiagnosis = 1;

        const unwindEntries = tree => {
            const line = {
                lineNum: globalLineCount++,
                subjid: tree.subjid,
                alias: tree.aliasId,
                consent: tree.optimiseConsent !== null ? 'YES' : 'NO',
                participation: tree.participation === 1 ? 'YES' : 'NO',
                visit_id: tree.visit_id,
                visit_date: tree.visit_date,
                reason_for_visit: tree.reason_for_visit,
                vitals_sbp: tree.vitals_sbp,
                vitals_dbp: tree.vitals_dbp,
                heart_rate: tree.heart_rate,
                habits_alcohol: tree.habits_alcohol,
                habits_smoking: tree.habits_smoking,
                EDSS_score: tree.EDSS_score || ''
            };
            if (tree.optimiseConsent === null)
                return line;
            for (let i = 0; i < globalMaxDiagnosis; i++) {
                line[`diagnosis_${i + 1}`] = tree.diagnoses[i] ? tree.diagnoses[i].diagnosis : '';
                line[`diagnosis_date_${i + 1}`] = tree.diagnoses[i] ? tree.diagnoses[i].diagnosisDate : '';
            }
            if (tree.visit_id === undefined)
                return line;
            for (let i = 0; i < globalMaxComorbidities; i++) {
                line[`comorbid_recorded_during_visit_code_${i + 1}`] = tree.comorbidities[i] ? tree.comorbidities[i].comorbid_recorded_during_visit_code : '';
                line[`comorbid_recorded_during_visit_name_${i + 1}`] = tree.comorbidities[i] ? tree.comorbidities[i].comorbid_recorded_during_visit_name : '';
            }
            for (let i = 0; i < globalMaxPregnancies; i++) {
                line[`pregnancy_start_date_${i + 1}`] = tree.pregnancies[i] ? tree.pregnancies[i].pregnancy_start_date : '';
                line[`pregnancy_end_date_${i + 1}`] = tree.pregnancies[i] ? tree.pregnancies[i].pregnancy_end_date : '';
                line[`pregnancy_outcome_${i + 1}`] = tree.pregnancies[i] ? tree.pregnancies[i].pregnancy_outcome : '';
            }
            for (let i = 0; i < globalMaxTreatments; i++) {
                line[`DMT_name_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].DMT_name : '';
                line[`DMT_dose_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].DMT_dose : '';
                line[`DMT_freq_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].DMT_freq : '';
                line[`DMT_start_date_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].DMT_start_date : '';
                line[`DMT_end_date_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].DMT_end_date : '';
            }
            for (let i = 0; i < globalMaxRelapses; i++) {
                line[`relapse_start_date_${i + 1}`] = tree.relapses[i] ? tree.relapses[i].relapse_start_date : '';
                line[`relapse_type_${i + 1}`] = tree.relapses[i] ? tree.relapses[i].relapse_type : '';
                line[`relapse_severity_${i + 1}`] = tree.relapses[i] ? tree.relapses[i].relapse_severity : '';
                line[`relapse_end_date_${i + 1}`] = tree.relapses[i] ? tree.relapses[i].relapse_end_date : '';
                line[`relapse_recovery_${i + 1}`] = tree.relapses[i] ? tree.relapses[i].relapse_recovery : '';
            }
            for (let i = 0; i < globalMaxSAEs; i++) {
                line[`SAE_type_${i + 1}`] = tree.SAEs[i] ? tree.SAEs[i].SAE_type : '';
                line[`SAE_start_date_${i + 1}`] = tree.SAEs[i] ? tree.SAEs[i].SAE_start_date : '';
                line[`SAE_end_date_${i + 1}`] = tree.SAEs[i] ? tree.SAEs[i].SAE_end_date : '';
                line[`SAE_note_${i + 1}`] = tree.SAEs[i] ? tree.SAEs[i].SAE_note : '';
            }
            for (let i = 0; i < globalMaxTreatments; i++) {
                line[`lab_test_id_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].lab_test_id : '';
                line[`lab_test_name_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].lab_test_name : '';
                line[`lab_test_value_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].lab_test_value : '';
                line[`lab_test_date_${i + 1}`] = tree.treatments[i] ? tree.treatments[i].lab_test_date : '';
            }
            for (let i = 0; i < globalMaxMRIs; i++) {
                line[`mri_id_${i + 1}`] = tree.mri[i] ? tree.mri[i].mri_id : '';
                line[`mri_result_name_${i + 1}`] = tree.mri[i] ? tree.mri[i].mri_result_name : '';
                line[`mri_result_value_${i + 1}`] = tree.mri[i] ? tree.mri[i].mri_result_value : '';
                line[`mri_date_${i + 1}`] = tree.mri[i] ? tree.mri[i].mri_date : '';
            }
            return line;
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
                        relapse_type: associatedData.filter(e => [1, 2, 3, 4, 5, 6, 7].includes(e.field)).reduce((a, e) => `${a}${`_${e.definition}`}`, ''),
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
            .select('VISITS.id as visitId', 'PATIENTS.id as patientId', 'PATIENTS.uuid as patientAlias', 'PATIENTS.optimiseConsent as patientOptimiseConsent', 'PATIENTS.participation as patientParticipation', 'VISITS.id as visitId', 'VISITS.visitDate', 'VISITS.type as visitType', 'VISITS.deleted as visitDeleted', 'PATIENTS.deleted as patientDeleted')
            .leftJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('VISITS.deleted', '-');

        /* creating a object containing { [patientId: string]: visitId[] } for later */
        const patientToVisitsMap = visits.reduce((a, e) => {
            if (a[e.patientId] === undefined) {
                a[e.patientId] = [];
            }
            a[e.patientId].push(e.visitId);
            return a;
        }, {});

        /* creating a map for patient -> diagnosis[] */
        const diagnosisMap = {};
        let allDiagnosis = await dbcon()('PATIENT_DIAGNOSIS')
            .select('PATIENT_DIAGNOSIS.patient as patient', 'PATIENT_DIAGNOSIS.diagnosisDate as diagnosisDate', 'AVAILABLE_DIAGNOSES.value as diagnosis')
            .leftJoin('AVAILABLE_DIAGNOSES', 'PATIENT_DIAGNOSIS.diagnosis', 'AVAILABLE_DIAGNOSES.id')
            .where('PATIENT_DIAGNOSIS.deleted', '-');
        allDiagnosis = allDiagnosis.map(e => ({ ...e, diagnosisDate: new Date(parseInt(e.diagnosisDate)).toDateString() }));
        const patients = patientList;
        // const patients = Object.keys(patientToVisitsMap);
        for (const each of patients) {
            diagnosisMap[each] = allDiagnosis.filter(e => parseInt(e.patient) === parseInt(each));
        }

        /* filter out the shadow visits */
        visits = visits.filter(e => e.visitType === 1);

        /* sort visit by patientId and date */
        visits.sort((a, b) => parseInt(a.patientId) - parseInt(b.patientId) || parseInt(a.visitDate) - parseInt(b.visitDate));

        /* get the data needed for each visit */
        let lastVisitPatient;
        let lastVisitDate;
        for (const visit of visits) {
            /* if last visit is for another patient then reset */
            if (lastVisitPatient !== visit.patientId) {
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
                DMT_freq: e.times && e.intervalUnit ? `${e.times} / ${ExportDataController.intervalUnitString(e.intervalUnit)}` : '',
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
            for (const e of all_ce) {
                if (all_ce_grouped[e.type] === undefined) {
                    all_ce_grouped[e.type] = [];
                }
                const entry = await fetchAssociatedDataForCEandTransform(e);
                all_ce_grouped[e.type].push(entry);
            }

            const MRI_and_lab = await dbcon()('ORDERED_TESTS')
                .select('*')
                .whereBetween(dbcon().raw('CAST(actualOccurredDate as integer)'), [lastVisitDate, thisVisitDate])
                .andWhere('deleted', '-')
                .whereIn('type', [1, 3])
                .whereIn('orderedDuringVisit', patientToVisitsMap[visit.patientId]);
            const tests_grouped = {};
            for (const e of MRI_and_lab) {
                if (tests_grouped[e.type] === undefined) {
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
                optimiseConsent: visit.patientOptimiseConsent,
                participation: visit.patientParticipation,
                diagnoses: diagnosisMap[visit.patientId],
                visit_id: visit.visitId,
                visit_date: new Date(parseInt(visit.visitDate)).toDateString(),
                reason_for_visit: visitDataTransformed[0] || '',
                vitals_sbp: visitDataTransformed[1] || '',
                vitals_dbp: visitDataTransformed[2] || '',
                heart_rate: visitDataTransformed[3] || '',
                habits_alcohol: visitDataTransformed[253] || '',
                habits_smoking: visitDataTransformed[252] || '',
                EDSS_score: visitDataTransformed[121] || '',
                pregnancies: pregnancy_transformed,
                treatments: treatment_transformed,
                comorbidities: comorbidities || [],
                relapses: all_ce_grouped[1] || [],
                SAEs: [...(all_ce_grouped[2] || []), ...(all_ce_grouped[3] || []), ...(all_ce_grouped[4] || []), ...(all_ce_grouped[5] || []), ...(all_ce_grouped[6] || [])],
                labs: tests_grouped[1] || [],
                mri: tests_grouped[3] || []
            };

            globalMaxComorbidities = csventry.comorbidities.length > globalMaxComorbidities ? csventry.comorbidities.length : globalMaxComorbidities;
            globalMaxPregnancies = csventry.pregnancies.length > globalMaxPregnancies ? csventry.pregnancies.length : globalMaxPregnancies;
            globalMaxTreatments = csventry.treatments.length > globalMaxTreatments ? csventry.treatments.length : globalMaxTreatments;
            globalMaxRelapses = csventry.relapses.length > globalMaxRelapses ? csventry.relapses.length : globalMaxRelapses;
            globalMaxSAEs = csventry.SAEs.length > globalMaxSAEs ? csventry.SAEs.length : globalMaxSAEs;
            globalMaxLabs = csventry.labs.length > globalMaxLabs ? csventry.labs.length : globalMaxLabs;
            globalMaxMRIs = csventry.mri.length > globalMaxMRIs ? csventry.mri.length : globalMaxMRIs;

            data.push(csventry);
            lastVisitDate = thisVisitDate;
        }

        const withVisitPatients = visits.map(visit => visit.patientId);
        const withoutVisitPatients = patientList.filter(function (id) {
            return !withVisitPatients.includes(id);
        });

        if (withoutVisitPatients.length > 0) {
            try {
                const noVisitPatients = await dbcon()('PATIENTS')
                    .select('PATIENTS.id', 'PATIENTS.uuid')
                    .whereIn('PATIENTS.id', withoutVisitPatients);

                noVisitPatients.forEach(patient => {
                    data.push({
                        subjid: patient.id,
                        aliasId: patient.uuid,
                        diagnoses: diagnosisMap[patient.id]
                    });
                });
            } catch (e) {
                console.error(e);
            }
        }

        data.reverse();

        const unwoundData = data.reduce((a, e) => {
            a.push(unwindEntries(e));
            return a;
        }, []);

        return [['SHORT_VISIT_SUMMARY', unwoundData]];
    }

    static getPatientDataCDISC(patientList) {

        const dataPromises = [];
        const STUDYID = 'optimise';

        /* Patient demographic data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENT_DEMOGRAPHIC.DOB as BRTHDTC', 'GENDERS.value as SEX',
                'DOMINANT_HANDS.value as DOMINANT', 'ETHNICITIES.value as ETHNIC', 'COUNTRIES.value as COUNTRY')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .leftOuterJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
            .leftOuterJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
            .leftOuterJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
            .leftOuterJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
            .then(result => ['DM', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'DM'
            }))]));

        // /* Smoking history data */
        // dataPromises.push(dbcon()('PATIENTS')
        //     .select('PATIENTS.uuid as USUBJID', 'SMOKING_HISTORY.value as SCORRES')
        //     .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
        //     .leftOuterJoin('SMOKING_HISTORY', 'SMOKING_HISTORY.id', 'PATIENT_DEMOGRAPHIC.smokingHistory')
        //     .whereIn('PATIENTS.id', patientList)
        //     .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
        //     .then(result => ['SC_Smoking', result.map(x => ({
        //         ...x,
        //         STUDYID,
        //         DOMAIN: 'SC'
        //     }))]));

        // /* Alcohol consumption data */
        // dataPromises.push(dbcon()('PATIENTS')
        //     .select('PATIENTS.uuid as USUBJID', 'ALCOHOL_USAGE.value as SUDOSFRQ')
        //     .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT_DEMOGRAPHIC.patient', 'PATIENTS.id')
        //     .leftOuterJoin('ALCOHOL_USAGE', 'ALCOHOL_USAGE.id', 'PATIENT_DEMOGRAPHIC.alcoholUsage')
        //     .whereIn('PATIENTS.id', patientList)
        //     .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
        //     .then(result => ['SU_AlcoholConsumption', result.map(x => ({
        //         ...x,
        //         STUDYID,
        //         DOMAIN: 'SU'
        //     }))]));

        /* Patient pregnancy data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENT_PREGNANCY.startDate as MHSTDTC', 'PREGNANCY_OUTCOMES.value as MHENRTPT',
                'PATIENT_PREGNANCY.outcomeDate as MHENDTC', 'ADVERSE_EVENT_MEDDRA.name as MHDECOD')
            .leftOuterJoin('PATIENT_PREGNANCY', 'PATIENT_PREGNANCY.patient', 'PATIENTS.id')
            .leftJoin('PREGNANCY_OUTCOMES', 'PREGNANCY_OUTCOMES.id', 'PATIENT_PREGNANCY.outcome')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENT_PREGNANCY.deleted', '-')
            .then(result => ['MH_Pregnancy', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'MH',
                MHCAT: 'GENERAL'
            }))]));

        /* Patient vital signs data (within Visit) */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_VISITS.idname as VSTEST', 'VISIT_DATA.value as VSORRES',
                'AVAILABLE_FIELDS_VISITS.unit as VSORRESU', 'VISITS.visitDate as VSDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('VISITS.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 1)
            .then(result => ['VS', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'VS'
            }))]));

        /* Patient Adverse Events data- Pregnancy */
        dataPromises.push(dbcon()('PATIENT_PREGNANCY')
            .select('PATIENTS.uuid as USUBJID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_PREGNANCY.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENT_PREGNANCY.deleted', '-')
            .then(result => ['AE_Pregnancy', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'AE',
                AETERM: x.AELLT
            }))]));

        /* Patient Adverse Events data- Clinical Events */
        dataPromises.push(dbcon()('CLINICAL_EVENTS')
            .select('PATIENTS.uuid as USUBJID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('CLINICAL_EVENTS.deleted', '-')
            .then(result => ['AE_ClinicalEvents', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'AE',
                AETERM: x.AELLT
            }))]));

        /* Patient Adverse Events data- Treatment interruptions */
        dataPromises.push(dbcon()('TREATMENTS_INTERRUPTIONS')
            .select('PATIENTS.uuid as USUBJID', 'ADVERSE_EVENT_MEDDRA.name as AELLT')
            .leftOuterJoin('TREATMENTS', 'TREATMENTS.id', 'TREATMENTS_INTERRUPTIONS.treatment')
            .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('TREATMENTS_INTERRUPTIONS.deleted', '-')
            .then(result => ['AE_Treatments', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'AE',
                AETERM: x.AELLT
            }))]));

        /* Patient medical history data */
        dataPromises.push(dbcon()('MEDICAL_HISTORY')
            .select('PATIENTS.uuid as USUBJID', 'RELATIONS.value as SREL', 'CONDITIONS.value as MHTERM',
                'MEDICAL_HISTORY.startDate as MHSTDTC', 'MEDICAL_HISTORY.outcome as MHENRTPT', 'MEDICAL_HISTORY.resolvedYear as MHENDTC')
            .leftOuterJoin('RELATIONS', 'RELATIONS.id', 'MEDICAL_HISTORY.relation')
            .leftOuterJoin('CONDITIONS', 'CONDITIONS.id', 'MEDICAL_HISTORY.conditionName')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('MEDICAL_HISTORY.deleted', '-')
            .then(result => ['MH_Relations', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'MH'
            }))]));

        /* Patient immunisation data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENT_IMMUNISATION.vaccineName as MHTERM', 'PATIENT_IMMUNISATION.immunisationDate as MHSTDTC')
            .leftOuterJoin('PATIENT_IMMUNISATION', 'PATIENT_IMMUNISATION.id', 'PATIENTS.id')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENT_IMMUNISATION.deleted', '-')
            .then(result => ['MH_Immunisation', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'MH'
            }))]));

        /* Patient diagnosis data */
        dataPromises.push(dbcon()('PATIENTS')
            .select('PATIENTS.uuid as USUBJID', 'PATIENT_DIAGNOSIS.diagnosisDate as MHSTDTC', 'AVAILABLE_DIAGNOSES.value as MHTERM')
            .leftOuterJoin('PATIENT_DIAGNOSIS', 'PATIENT_DIAGNOSIS.patient', 'PATIENTS.id')
            .leftOuterJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('PATIENT_DIAGNOSIS.deleted', '-')
            .then(result => ['MH_Diagnosis', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'MH',
                MHCAT: 'PRIMARY DIAGNOSIS',
                MHSCAT: 'ONSET COURSE'
            }))]));

        /* Patient CE data */
        dataPromises.push(dbcon()('CLINICAL_EVENTS')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_CLINICAL_EVENT_TYPES.name as CETERM',
                'CLINICAL_EVENTS.dateStartDate as CESTDTC', 'CLINICAL_EVENTS.endDate as CEENDTC',
                'CLINICAL_EVENTS_DATA.value as CESEV', 'AVAILABLE_FIELDS_CE.id as fieldId',
                'CLINICAL_EVENTS_DATA.field', 'CLINICAL_EVENTS_DATA.deleted')
            .leftOuterJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'CLINICAL_EVENTS.type')
            .leftOuterJoin('CLINICAL_EVENTS_DATA', 'CLINICAL_EVENTS_DATA.clinicalEvent', 'CLINICAL_EVENTS.id')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
            .andWhere('CLINICAL_EVENTS.deleted', '-')
            .then(result => ['CE', result.map(x => ({
                ...x,
                field: undefined,
                fieldId: undefined,
                deleted: undefined,
                STUDYID,
                DOMAIN: 'CE',
                CESEV: x.fieldId && x.fieldId !== 9 && x.CESEV ? null : x.CESEV
            }))]));

        /* Patient Evoked Potential test data */
        dataPromises.push(dbcon()('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_TESTS.cdiscName as NVTEST',
                'TEST_DATA.value as NVORRES', 'AVAILABLE_FIELDS_TESTS.unit as NVORRESU', 'AVAILABLE_FIELDS_TESTS.laterality as NVLAT',
                'ORDERED_TESTS.actualOccurredDate as NVDTC', 'ORDERED_TESTS.expectedOccurDate as VISITDY')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 2)
            .then(result => ['NV', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'NV',
                NVCAT: 'Visual Evoked Potential (VEP)'
            }))]));

        /* Patient Laboratory Test data */
        dataPromises.push(dbcon()('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_TESTS.idname as LBTEST', 'TEST_DATA.value as LBORRES',
                'ORDERED_TESTS.expectedOccurDate as LBDTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 1)
            .then(result => ['LB', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'LB',
                LBTESTCD: x.LBTEST
            }))]));

        /* Lumbar Puncture */
        dataPromises.push(dbcon()('TEST_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_TESTS.idname as LBTEST', 'TEST_DATA.value as LBORRES',
                'ORDERED_TESTS.actualOccurredDate as LBDTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 4)
            .then(result => ['LBPR', result.map(x => ({
                ...x,
                STUDYID,
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
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_TESTS.idname as MOTEST', 'TEST_DATA.value as MOORRES',
                'ORDERED_TESTS.actualOccurredDate as MODTC')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('TEST_DATA.deleted', '-')
            .andWhere('ORDERED_TESTS.deleted', '-')
            .andWhere('ORDERED_TESTS.type', 3)
            .then(result => ['MO', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'MO'
            }))]));

        /* Clinical Event data */
        dataPromises.push(dbcon()('CLINICAL_EVENTS_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_CE.idname as FATEST', 'CLINICAL_EVENTS_DATA.value as FAORRES')
            .leftOuterJoin('CLINICAL_EVENTS', 'CLINICAL_EVENTS.id', 'CLINICAL_EVENTS_DATA.clinicalEvent')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('CLINICAL_EVENTS_DATA.deleted', '-')
            .then(result => ['FA', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'FA'
            }))]));

        /* Patient Symptoms and Signs at Visits */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_VISITS.idname as CETERM', 'VISIT_DATA.value as CEOCCUR', 'VISITS.visitDate as CEDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere(function () {
                this.whereIn('AVAILABLE_FIELDS_VISITS.section', [2, 3]);
            })
            .andWhere('VISIT_DATA.deleted', '-')
            .then(result => ['CE_SymptomsSigns', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'CE'
            }))]));

        /* Performance Measures Visual Acuity */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_VISITS.idname as OETEST',
                'VISIT_DATA.value as OEORRES', 'AVAILABLE_FIELDS_VISITS.laterality as OELAT', 'VISITS.visitDate as OEDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'VisualAcuity')
            .then(result => ['OE', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'OE',
                OELOC: 'EYE'
            }))]));

        /* Performance Measures Questionnaires */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_VISITS.idname as QSTEST',
                'VISIT_DATA.value as QSORRES', 'VISITS.visitDate as QSDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'QS')
            .then(result => ['QS', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'QS',
                QSSTRESN: x.QSORRES
            }))]));

        /* Performance Measures Functional Tests */
        dataPromises.push(dbcon()('VISIT_DATA')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_FIELDS_VISITS.idname as FTTEST',
                'VISIT_DATA.value as FTORRES', 'VISITS.visitDate as FTDTC')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .whereIn('PATIENTS.id', patientList)
            .andWhere('VISIT_DATA.deleted', '-')
            .andWhere('AVAILABLE_FIELDS_VISITS.subsection', 'FT')
            .andWhere('AVAILABLE_FIELDS_VISITS.section', 4)
            .then(result => ['FT', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'FT',
                FTSTRESN: x.FTORRES
            }))]));

        /* Patient treatment data- Domain EC may be more appropriate */
        dataPromises.push(dbcon()('TREATMENTS')
            .select('PATIENTS.uuid as USUBJID', 'AVAILABLE_DRUGS.name as EXTRT',
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
            .andWhere('TREATMENTS.deleted', '-')
            .then(result => ['EX', result.map(x => ({
                ...x,
                STUDYID,
                DOMAIN: 'EX',
                EXDOSFRQ: x.times && x.intervalUnit ? `${x.times} / ${ExportDataController.intervalUnitString(x.intervalUnit)}` : undefined
            }))]));

        // Returning all domains as separate promise on matrix
        return Promise.all(dataPromises);
    }
}

export default ExportDataController;
