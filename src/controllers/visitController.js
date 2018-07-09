const visitCore = require('../core/visit');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

function VisitController() {
    this.visit = new visitCore();

    this.getVisitsOfPatient = VisitController.prototype.getVisitsOfPatient.bind(this);
    this.createVisit = VisitController.prototype.createVisit.bind(this);
    this.deleteVisit = VisitController.prototype.deleteVisit.bind(this);
}

VisitController.prototype.getVisitsOfPatient = function (req, res) {
    if (!req.query.hasOwnProperty('patientId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }

    this.visit.getVisit(req.query.patientId).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

VisitController.prototype.createVisit = function (req, res) {
    if (!req.body.hasOwnProperty('patientId') || !req.body.hasOwnProperty('visitDate')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.visit.createVisit(req.requester, req.body).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return;
    });
};

VisitController.prototype.deleteVisit = function (req, res) {
    if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (!req.body.hasOwnProperty('visitId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.visit.deleteVisit(req.requester, req.body.visitId).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
    });
};

module.exports = VisitController;

// class VisitController {
//     static getVisitsOfPatient(req, res){
//         if (!isEmptyObject(req.query) && Object.keys(req.query).length === 1 && typeof (req.query.patientId) === 'string') {
//             knex('PATIENTS')
//                 .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', { visitId: 'VISITS.id' }, 'VISITS.visitDate')
//                 .leftOuterJoin('VISITS', 'PATIENTS.id', 'VISITS.patient')
//                 .where({ 'PATIENTS.aliasId': req.query.patientId, 'VISITS.deleted': '-' })
//                 .then(result => {
//                     res.status(200).json(result);
//                     return ;
//                 });
//         } else {
//             res.status(400).send('The query string must have one and only one parameter "patientId"');
//             return ;
//         }
//     }

//     static createVisit(req, res){
//         if (req.body.patientId && req.body.visitDate && validateAndFormatDate(req.body.visitDate)){
//             knex('PATIENTS')
//                 .select('id')
//                 .where({ 'aliasId': req.body.patientId, 'deleted': '-' })
//                 .then(result => {
//                     if (result.length === 0) {
//                         res.status(404).send('Can\'t seem to find your patient!');
//                         return ;
//                     } else if (result.length === 1) {
//                         const entryObj = { 'patient': result[0]['id'], 'visitDate': validateAndFormatDate(req.body.visitDate) };
//                         if (req.body.type && typeof (req.body.type) === 'number')
//                             entryObj.type = req.body.type;
//                         createEntry(req, res, 'VISITS', entryObj, 'Error. Visit might already exists.');
//                         return ;
//                     } else {
//                         res.status(500).send('Database error');
//                         return ;
//                     }
//                 })
//                 .catch(err => {
//                     if (process.env.NODE_ENV !== 'production')
//                         console.log(`Error catched : ${err}`);
//                     res.status(500).send(err);
//                     return ;
//                 });
//         } else {
//             res.status(400).send('Error. Please provide the suitable parameters.');
//             return ;
//         }
//     }

//     static deleteVisit(req, res){
//         if (req.requester.priv !== 1)
//             console.log('BAD PRIVILEDGES');
//         if (req.requester.priv === 1 && req.body.visitId) {
//             knex('VISITS')
//                 .select('id')
//                 .where({ 'id': req.body.visitId, 'deleted': '-' })
//                 .then(result => {
//                     if (result.length === 0) {
//                         res.status(404).send('Can\'t seem to find your visit!');
//                         return ;
//                     } else if (result.length === 1) {
//                         const whereObj = { 'id': req.body.visitId };
//                         deleteEntry(req, res, 'VISITS', whereObj, `Visit for id ${  req.body.visitId}`, 1);
//                         return ;
//                     } else {
//                         res.status(500).send('Database error');
//                         return ;
//                     }
//                 })
//                 .catch(err => {
//                     if (process.env.NODE_ENV !== 'production')
//                         console.log(`Error catched : ${err}`);
//                     res.status(500).send(err);
//                     return ;
//                 });
//         } else {
//             res.status(401).send('Error. You do not have permission; or the request is malformed');
//             return ;
//         }
//     }

// }

// module.exports = VisitController;