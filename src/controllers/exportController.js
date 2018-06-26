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

        /* patient medical history data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'MEDICAL_HISTORY.relation', 'MEDICAL_HISTORY.conditionName', 'MEDICAL_HISTORY.startDate', 'MEDICAL_HISTORY.outcome', 'MEDICAL_HISTORY.resolvedYear')
            .leftOuterJoin('MEDICAL_HISTORY', 'PATIENTS.id', 'MEDICAL_HISTORY.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('MEDICAL_HISTORY.deleted', '-')
            .then(result => {
                helper(result, 'mh');
            });

        /* patient immunisation data */

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'PATIENT_IMMUNISATION.vaccineName', 'PATIENT_IMMUNISATION.immunisationDate')
            .leftOuterJoin('PATIENT_IMMUNISATION', 'PATIENTS.id', 'PATIENT_IMMUNISATION.patient')
            .where('PATIENTS.deleted', '-')
            .andWhere('PATIENT_IMMUNISATION.deleted', '-')
            .then(result => {
                helper(result, 'immunisation');
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
