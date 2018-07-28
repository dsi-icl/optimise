const ErrorHelper = require('../utils/error_helper');
const clinicalEventCore = require('../core/clinicalEvent');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const moment = require('moment');

function CeController() {
    this.clinicalEvent = new clinicalEventCore();

    this.createCe = CeController.prototype.createCe.bind(this);
    this.updateCe = CeController.prototype.updateCe.bind(this);
    this.deleteCe = CeController.prototype.deleteCe.bind(this);
}

CeController.prototype.createCe = function (req, res) {
    if ((req.body.hasOwnProperty('visitId') || req.body.hasOwnProperty('patient')) && req.body.hasOwnProperty('startDate') && req.body.hasOwnProperty('type') && req.body.hasOwnProperty('meddra') &&
        typeof req.body.visitId === 'number' && typeof req.body.startDate === 'string' && typeof req.body.type === 'number' && typeof req.body.meddra === 'number') {
        let momentStart = moment(req.body.startDate, moment.ISO_8601);
        if (!momentStart.isValid()) {
            res.status(400).json(ErrorHelper(message.dateError[momentStart.invalidAt()], new Error(message.userError.INVALIDDATE)));
            return;
        }
        let ce = {};
        if (req.body.hasOwnProperty('visitId'))
            ce.recordedDuringVisit = req.body.visitId;
        if (req.body.hasOwnProperty('patient'))
            ce.patient = req.body.patient;
        ce.type = req.body.type;
        ce.meddra = req.body.meddra;
        ce.dateStartDate = momentStart.toString();
        ce.createdByUser = req.user.id;
        this.clinicalEvent.createClinicalEvent(ce).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!((req.body.hasOwnProperty('visitId') || req.body.hasOwnProperty('patient')) && req.body.hasOwnProperty('startDate') && req.body.hasOwnProperty('type') && req.body.hasOwnProperty('meddra'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

CeController.prototype.updateCe = function (req, res) {
    if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.clinicalEvent.updateClinicalEvent(req.user, req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
    });
};

CeController.prototype.deleteCe = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (req.body.hasOwnProperty('ceId')) {
        this.clinicalEvent.deleteClinicalEvent(req.user, { 'id': req.body.ceId }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (!req.body.hasOwnProperty('ceId')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

module.exports = CeController;