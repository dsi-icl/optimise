const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class CeController {
    createCe(req, res){
        if ((req.body.visitId && !req.body.patientId) || (!req.body.visitId && req.body.patientId)){
            if (req.body.startDate && validateAndFormatDate(req.body.startDate)) {
                let entryObj = {
                    'ordered_during_visit': req.body.visitId,
                    'type': req.body.type,
                    'date_start_date': req.body.startDate,
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
}

const _singleton = new CeController();
module.exports = _singleton;