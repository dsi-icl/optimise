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
    if ((req.body.hasOwnProperty('visitId') || req.body.hasOwnProperty('patient')) && req.body.hasOwnProperty('dateStartDate') && req.body.hasOwnProperty('type') &&
        typeof req.body.visitId === 'number' && typeof req.body.dateStartDate === 'string' && typeof req.body.type === 'number') {
        let momentStart = moment(req.body.dateStartDate, moment.ISO_8601);
        if (!momentStart.isValid()) {
            let msg = (momentStart.invalidAt() === undefined || momentStart.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentStart.invalidAt()];
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        let momentEnd = moment(req.body.endDate, moment.ISO_8601);
        if (req.body.hasOwnProperty('endDate') && !momentEnd.isValid()) {
            let msg = (momentEnd.invalidAt() === undefined || momentEnd.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentEnd.invalidAt()];
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        if (req.body.hasOwnProperty('meddra') && isNaN(parseInt(req.body.meddra))) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        }
        let ce = {};
        if (req.body.hasOwnProperty('visitId'))
            ce.recordedDuringVisit = req.body.visitId;
        if (req.body.hasOwnProperty('patient'))
            ce.patient = req.body.patient;
        if (req.body.hasOwnProperty('endDate'))
            ce.endDate = momentEnd.valueOf();
        ce.type = req.body.type;
        ce.meddra = req.body.meddra ? parseInt(req.body.meddra) : undefined;
        ce.dateStartDate = momentStart.valueOf();
        ce.createdByUser = req.user.id;
        this.clinicalEvent.createClinicalEvent(ce).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    } else if (!((req.body.hasOwnProperty('visitId') || req.body.hasOwnProperty('patient')) && req.body.hasOwnProperty('dateStartDate') && req.body.hasOwnProperty('type'))) {
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
    let ce = Object.assign({}, req.body);
    let momentStart = moment(req.body.dateStartDate, moment.ISO_8601);
    if (req.body.hasOwnProperty('dateStartDate') && !momentStart.isValid()) {
        let msg = (momentStart.invalidAt() === undefined || momentStart.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentStart.invalidAt()];
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    } else if (req.body.hasOwnProperty('dateStartDate')) {
        ce.dateStartDate = momentStart.valueOf();
    }
    let momentEnd = moment(req.body.endDate, moment.ISO_8601);
    if (req.body.hasOwnProperty('endDate') && !momentEnd.isValid()) {
        let msg = (momentEnd.invalidAt() === undefined || momentEnd.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentEnd.invalidAt()];
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    } else if (req.body.hasOwnProperty('endDate')) {
        ce.endDate = momentEnd.valueOf();
    }
    this.clinicalEvent.updateClinicalEvent(req.user, ce).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        return false;
    });
};

CeController.prototype.deleteCe = function (req, res) {
    if (req.body.hasOwnProperty('ceId')) {
        this.clinicalEvent.deleteClinicalEvent(req.user, { 'id': req.body.ceId }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
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