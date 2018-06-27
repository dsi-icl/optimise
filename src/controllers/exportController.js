const knex = require('../utils/db-connection');
const selectorUtils = require('../utils/selector-utils');
const fs = require('fs');
const path = require('path');

class ExportController {

    // export data for ALL patients

    exportDb(req, res) {

        const fileName = 'OptimiseData.csv';

        /* Patient demographic data file */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENT_DEMOGRAPHIC.DOB', 'PATIENT_DEMOGRAPHIC.gender', 'PATIENT_DEMOGRAPHIC.dominantHand', 'PATIENT_DEMOGRAPHIC.ethnicity', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .where('PATIENTS.deleted', '-')
            .then(result => {
                helper(result, 'dm');
            });

        /* Patient medical history data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'MEDICAL_HISTORY.relation', 'MEDICAL_HISTORY.conditionName', 'MEDICAL_HISTORY.startDate', 'MEDICAL_HISTORY.outcome', 'MEDICAL_HISTORY.resolvedYear')
            .leftOuterJoin('MEDICAL_HISTORY', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('MEDICAL_HISTORY.deleted', '-')
            .then(result => {
                helper(result, 'mh');
            });

        /* Patient immunisation data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'PATIENT_IMMUNISATION.vaccineName', 'PATIENT_IMMUNISATION.immunisationDate')
            .leftOuterJoin('PATIENT_IMMUNISATION', 'PATIENTS.id', 'PATIENT_IMMUNISATION.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_IMMUNISATION.deleted', '-')
            .then(result => {
                helper(result, 'immunisation');
            });

        /* Patient visit data */

        knex('VISIT_DATA')
            .select('VISIT_DATA.value', 'VISIT_DATA.field', 'VISITS.visitDate', 'AVAILABLE_FIELDS_VISITS.definition', 'PATIENTS.aliasId', 'VISITS.patient')
            .leftOuterJoin('VISITS', 'VISITS.id', 'VISIT_DATA.visit')
            .leftOuterJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('VISIT_DATA.deleted', '-')
            .then(result => {
                helper(result, 'visit');
            });

        /* Patient test data */

        knex('TEST_DATA')
            .select('TEST_DATA.value', 'TEST_DATA.field', 'ORDERED_TESTS.expectedOccurDate', 'ORDERED_TESTS.actualOccuredDate', 'AVAILABLE_FIELDS_TESTS.definition', 'VISITS.patient', 'ORDERED_TESTS.orderedDuringVisit', 'PATIENTS.aliasId')
            .leftOuterJoin('ORDERED_TESTS', 'ORDERED_TESTS.id', 'TEST_DATA.test')
            .leftOuterJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .leftOuterJoin('VISITS', 'VISITS.id', 'ORDERED_TESTS.orderedDuringVisit')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
            .where('TEST_DATA.deleted', '-')
            .then(result => {
                helper(result, 'test');
            });

        /* Patient clinical event data - visit not required */

        knex('CLINICAL_EVENTS_DATA')
            .select('CLINICAL_EVENTS_DATA.value', 'CLINICAL_EVENTS_DATA.field', 'CLINICAL_EVENTS.dateStartDate', 'CLINICAL_EVENTS.endDate', 'AVAILABLE_FIELDS_CE.definition', 'CLINICAL_EVENTS.patient', 'PATIENTS.aliasId')
            .leftOuterJoin('CLINICAL_EVENTS', 'CLINICAL_EVENTS.id', 'CLINICAL_EVENTS_DATA.clinicalEvent')
            .leftOuterJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'CLINICAL_EVENTS.patient')
            .where('CLINICAL_EVENTS_DATA.deleted', '-')
            .then(result => {
                helper(result, 'test');
            });

        /* result: promise, prefix: (string) filename prefix */

        var helper = function(result, prefix) {

            if (result.length >= 1) {
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
                let tempSavedPath = `/temp/${tempfileName}`;
                //tempSavedPath = path.normalize(tempSavedPath);
                fs.writeFile(tempSavedPath, fileContents, err => {
                    if (err) {
                        throw err;
                    } else {
                        //res.status(200).download(tempSavedPath, tempfileName);
                    }
                });
            } else {
                res.status(204).send('There are no patient entries in the database.');
            }
        };
    }
}

module.exports = new ExportController();
