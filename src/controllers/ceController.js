const {validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry} = require('../utils/controller-utils');

class CeController {
    createCe(req, res){
        if (req.body.visitId){
            if (req.body.startDate && validateAndFormatDate(req.body.startDate)) {    //have to check for patient / visit existence!
                let entryObj = {
                    'recordedDuringVisit': req.body.visitId,
                    'type': req.body.type,
                    'dateStartDate': validateAndFormatDate(req.body.startDate),
                    'endDate': req.body.endDate                             //have to check for endDate format too!!
                }
                createEntry(req, res, 'CLINICAL_EVENTS', entryObj, 'databaseError');
            } else {
                res.status(400).send('wrong date format');
            }
        } else {
            res.status(400).send('Missing visit id');
        }
    }

    deleteCe(req, res) {
        if (req.requester.priv !== 1) {
            res.status(401).send("Unauthorized : You should be identified as an Administrator to do so.");
        }
        deleteEntry(req, res, 'CLINICAL_EVENTS', {'id': req.body.ceId}, req.body.ceId, 1);
    }
}

const _singleton = new CeController();
module.exports = _singleton;