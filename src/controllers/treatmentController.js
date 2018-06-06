const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class TreatmentController {
    createTreatment(req, res){
        let entryObj = {
            'ordered_during_visit': req.body.visitId,
            'drug': req.body.drugId,
            'dose': req.body.dose,
            'unit': req.body.unit,   //hardcoded SQL: only mg or cc
            'form': req.body.form,   //hardcoded SQL: only oral or IV
            'times_per_day': req.body.timesPerDay,
            'duration_weeks': req.body.durationInWeeks,
            'terminated_date': req.body.terminatedDate && validateAndFormatDate(req.body.terminatedDate) ? validateAndFormatDate(req.body.terminatedDate) : null,
            'terminated_reason': req.body.terminatedReason && validateAndFormatDate(req.body.terminatedReason) ? validateAndFormatDate(req.body.terminatedReason) : null
        }
        createEntry(req, res, 'treatments', entryObj, 'databaseError');
    }

    addTerminationDate(req, res){    //for adding termination date
        if ('terminatedDate' in req.body && 'terminatedReason' in req.body && req.body.length === 4) {
            let whereObj = {'ordered_during_visit': req.body.visitId, 'drug': req.body.drugId};
            updateEntry(req, res, 'treatments', whereObj, newObj, whatIsUpdated, expectedNumAffected /* LT 0 */);
        }
    }

    editTreatment(req, res){
        if (req.requester.priv === 1){
            let whereObj = {'ordered_during_visit': req.body.visitId, 'drug': req.body.drugId};
            let newObj = Object.assign({}, req.body);   //need to change naming
            updateEntry(req, res, 'treatments', whereObj, newObj, whatIsUpdated, expectedNumAffected /* LT 0 */);
        }
    }

    deleteTreatment(req, res) {
        if (req.requester.priv !== 1) {
            res.status(401).send("Unauthorized : You should be identified as an Administrator to do so.");
            return;
        }
        deleteEntry(req, res, 'treatments', {'id': req.body.treatmentId}, req.body.treatmentId, 1);
    }

    addInterruption(req, res){
        let entryObj = {
            'treatment' : req.body.treatmentId,
            'start_date' : (req.body.start_date && validateAndFormatDate(req.body.start_date) ? req.body.start_date : null ),
            'end_date' : (req.body.end_date && validateAndFormatDate(req.body.end_date) ? req.body.end_date : null ),
            'reason' : req.body.reason,
            'created_time' : (req.body.created_date && validateAndFormatDate(req.body.created_date) ? req.body.created_date : null )
        }
        createEntry(req, res, 'treatments_interruptions', entryObj, 'Couldn\'t create entry');
    }

    deleteInterruption(req, res) {
        if (req.requester.priv !== 1) {
            res.status(401).send("Unauthorized : You should be identified as an Administrator to do so.");
        }
        deleteEntry(req, res, 'treatments_interruptions', {'id': req.body.treatmentInterId}, req.body.treatmentInterId, 1);
    }
}

const _singleton = new TreatmentController();
module.exports = _singleton;