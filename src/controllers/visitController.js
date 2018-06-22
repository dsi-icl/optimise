const { isEmptyObject, validateAndFormatDate } = require('../utils/basic-utils');
const { createEntry, deleteEntry } = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class VisitController {
    static getVisitsOfPatient(req, res){
        if (!isEmptyObject(req.query) && Object.keys(req.query).length === 1 && typeof (req.query.patientId) === 'string') {
            knex('PATIENTS')
                .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', { visitId: 'VISITS.id' }, 'VISITS.visitDate')
                .leftOuterJoin('VISITS', 'PATIENTS.id', 'VISITS.patient')
                .where({ 'PATIENTS.aliasId': req.query.patientId, 'VISITS.deleted': '-' })
                .then(result => res.status(200).json(result));
        } else {
            res.status(400).send('The query string must have one and only one parameter "patientId"');
        }
    }

    static createVisit(req, res){
        if (req.body.patientId && req.body.visitDate && validateAndFormatDate(req.body.visitDate)){
            knex('PATIENTS')
                .select('id')
                .where({ 'aliasId': req.body.patientId, 'deleted': '-' })
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send('Can\'t seem to find your patient!');
                    } else if (result.length === 1) {
                        const entryObj = { 'patient': result[0]['id'], 'visitDate': validateAndFormatDate(req.body.visitDate) };
                        createEntry(req, res, 'VISITS', entryObj, 'Error. Visit might already exists.');
                    } else {
                        res.status(500).send('Database error');
                    }
                });
        } else {
            res.status(400).send('Error. Please provide the suitable parameters.');
        }
    }

    static deleteVisit(req, res){
        if (req.requester.priv === 1 && req.body.visitId) {
            knex('VISITS')
                .select('id')
                .where({ 'id': req.body.visitId, 'deleted': '-' })
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send('Can\'t seem to find your visit!');
                    } else if (result.length === 1) {
                        const whereObj = { 'id': req.body.visitId };
                        deleteEntry(req, res, 'VISITS', whereObj, `Visit for id ${  req.body.visitId}`, 1);
                    } else {
                        res.status(500).send('Database error');
                    }
                });
        } else {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        }
    }

}

module.exports = VisitController;