const knex = require('../utils/db-connection');
const SelectorUtils = require('../utils/selector-utils');
const fs = require('fs');

class ExportController {

    // export data for ALL patients

    exportDb(req, res) {

        const fileName = 'OptimiseData.csv';

        // TODO: replace with using SelectorUtils to reuse the queries passing an array of all IDs

        // Patient demographic data file
        // All files should include aliasId

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENT_DEMOGRAPHIC.DOB', 'PATIENT_DEMOGRAPHIC.gender', 'PATIENT_DEMOGRAPHIC.dominantHand', 'PATIENT_DEMOGRAPHIC.ethnicity', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .where('PATIENTS.deleted', null)
            .then(result => {
                // TODO: CDISC mapping for headers
                const tempfileName = `dm${fileName}`;
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
                const tempSavedPath = __dirname+`/temp/${tempfileName}`;
                fs.writeFile(tempSavedPath, fileContents, err => {
                    if (err) {
                        throw err;
                    } else {
                        res.status(200).download(tempSavedPath, tempfileName);
                    }
                });
            });
    }
}

module.exports = new ExportController();
