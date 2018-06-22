const knex = require('../utils/db-connection');
const SelectorUtils = require('../utils/selector-utils');
var Stream = require('stream');
var fs = require('fs');

var cdiscTermsDM = {
    aliasId : "USUBJID",
    study : "STUDYID",
    DOB : "BRTHDTC",
    gender : "SEX",
    dominantHand : "DOMINANT",
    ethnicity : "ETHNIC",
    countryOfOrigin : "COUNTRY",
    alcoholUsage : "ALCOHOL", // TODO: CHANGE TO SU 
    smokingHistory : "SMOKING" // TODO: CHANGE TO SC
};

class ExportController {

    // export data for ALL patients

    exportDb(req, res) {

        //let fileName = 'optimiseData' + new Date() + '.csv';
        let fileName = 'optimiseData' + new Date();

        // May replace with using SelectorUtils to reuse the queries passing an array of all IDs

        // Patient demographics file
        // All files should include aliasId

        knex('PATIENTS')
            .select('PATIENTS.id', 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENT_DEMOGRAPHIC.DOB', 'PATIENT_DEMOGRAPHIC.gender', 'PATIENT_DEMOGRAPHIC.dominantHand', 'PATIENT_DEMOGRAPHIC.ethnicity', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENT.id', 'PATIENT_DEMOGRAPHIC.patient')
            .where('PATIENTS.deleted', null)
            .then(result => {
                const returnObj = { dmData: result };
                let fileName = 'dm' + fileName;
                let fileContents = Buffer.from(returnObj);
                let tempSavedPath = '/temp/' + fileName;
                fs.writeFile(tempSavedPath, fileContents, function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    res.status(200).download(tempSavedPath, fileName);
                })
                return;
            });

        // res.setHeader('Content-type', 'application/csv');
        // res.setHeader('Access-Control-Allow-Origin', '*');
        // res.setHeader('Content-disposition', 'attachment; filename=db.csv');    
        // res.end();   

    }
    
};

module.exports = new ExportController();
