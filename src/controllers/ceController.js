const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class CeController {
    createCe(req, res){
        if ((req.body.visitId && !req.body.patientId) || (!req.body.visitId && req.body.patientId)){
            if (req.body.startDate && validateAndFormatDate(req.body.startDate)) {    //have to check for patient / visit existence!
                let entryObj = {
                    'patient': req.body.patientId ? req.body.patientId :null,
                    'recorded_during_visit': req.body.visitId ? req.body.visitId : null,
                    'type': req.body.type,
                    'date_start_date': validateAndFormatDate(req.body.startDate),
                    'end_date': req.body.endDate                             //have to check for endDate format too!!
                }
                createEntry(req, res, 'clinical_events', entryObj, 'databaseError');
            } else {
                res.status(400).send('wrong date format');
            }
        } else {
            res.status(400).send('You can either send patientId or visitId but not both.');
        }
    }

    deleteCe(req, res) {
        if (req.requester.priv !== 1) {
            res.status(401).send("Unauthorized : You should be identified as an Administrator to do so.");
        }
        deleteEntry(req, res, 'clinical_events', {'id': req.body.ceId}, req.body.ceId, 1);
    }
}

const _singleton = new CeController();
module.exports = _singleton;