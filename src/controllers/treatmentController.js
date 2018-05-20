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

    addInterruption(req, res){
        
    }
}

const _singleton = new TreatmentController();
module.exports = _singleton;