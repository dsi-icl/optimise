const { validateAndFormatDate } = require('../utils/basic-utils');
const { createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class TreatmentController {
    createTreatment(req, res){
        if (!(req.body.visitId && req.body.drugId && req.body.dose &&
            req.body.unit && req.body.form && req.body.timesPerDay && req.body.durationInWeeks)) {
            res.status(400).send('Missing information for creation of the treatment');
            return ;
        }
        let entryObj = {
            'orderedDuringVisit': req.body.visitId,
            'drug': req.body.drugId,
            'dose': req.body.dose,
            'unit': req.body.unit,   //hardcoded SQL: only mg or cc
            'form': req.body.form,   //hardcoded SQL: only oral or IV
            'timesPerDay': req.body.timesPerDay,
            'durationWeeks': req.body.durationInWeeks,
            'terminatedDate': req.body.terminatedDate && validateAndFormatDate(req.body.terminatedDate) ? validateAndFormatDate(req.body.terminatedDate) : null,
            'terminatedReason': req.body.terminatedReason && validateAndFormatDate(req.body.terminatedReason) ? validateAndFormatDate(req.body.terminatedReason) : null
        };
        createEntry(req, res, 'TREATMENTS', entryObj, 'databaseError');
    }

    addTerminationDate(req, res){    //for adding termination date
        if (req.body.treatmentId && req.body.terminationDate && validateAndFormatDate(req.body.terminationDate) && req.body.terminatedReason) {
            knex('TREATMENTS')
                .where({ 'id': req.body.treatmentId, 'deleted':null })
                .update({
                    'terminatedDate': validateAndFormatDate(req.body.terminationDate),
                    'terminatedReason': req.body.terminatedReason })
                .then(result => {
                    if (result === 1) {
                        res.status(200).send(result);
                        return ;
                    }
                    else {
                        res.status(404).send('Couldn\'t find the treatment. It might be set as deleted');
                        return ;
                    }
                })
                .catch(err => {
                    res.status(500).send(`Database Error : ${  err}`);
                    return ;
                });
        }
        else {
            res.status(400).send('Missing information');
            return ;
        }
    }

    editTreatment(req, res){
        if (req.requester.priv == 1){
            let whereObj = { 'id': req.body.id, 'deleted':null };
            let newObj = Object.assign({}, req.body);   //need to change naming
            updateEntry(req, res, 'TREATMENTS', whereObj, newObj, req.body.id, 1 /* LT 0 */);
        }
        else {
            res.status(401).send('Unauthorized : You should be identified as an Administrator to do so.');
            return ;
        }
    }

    deleteTreatment(req, res) {
        if (req.requester.priv !== 1) {
            res.status(401).send('Unauthorized : You should be identified as an Administrator to do so.');
            return;
        }
        if (!req.body.treatmentId) {
            res.status(400).send('Missing information to deletion');
            return ;
        }
        deleteEntry(req, res, 'TREATMENTS', { 'id': req.body.treatmentId }, req.body.treatmentId, 1);
    }

    addInterruption(req, res){
        if (req.body.treatmentId) {
            let entryObj = {
                'treatment' : req.body.treatmentId,
                'startDate' : (req.body.start_date && validateAndFormatDate(req.body.start_date) ? validateAndFormatDate(req.body.start_date) : null),
                'endDate' : (req.body.end_date && validateAndFormatDate(req.body.end_date) ? validateAndFormatDate(req.body.end_date) : null),
                'reason' : req.body.reason,
            };
            createEntry(req, res, 'TREATMENTS_INTERRUPTIONS', entryObj, 'Couldn\'t create entry');
            return ;
        }
        res.status(400).send('Missing information to proceed the request');
    }

    deleteInterruption(req, res) {
        if (req.requester.priv !== 1) {
            res.status(401).send('Unauthorized : You should be identified as an Administrator to do so.');
        }
        deleteEntry(req, res, 'TREATMENTS_INTERRUPTIONS', { 'id': req.body.treatmentInterId }, req.body.treatmentInterId, 1);
    }
}

const _singleton = new TreatmentController();
module.exports = _singleton;