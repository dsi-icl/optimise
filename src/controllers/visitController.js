const visitCore = require('../core/visit');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');

function VisitController() {
    this.visit = new visitCore();

    this.getVisitsOfPatient = VisitController.prototype.getVisitsOfPatient.bind(this);
    this.createVisit = VisitController.prototype.createVisit.bind(this);
    this.deleteVisit = VisitController.prototype.deleteVisit.bind(this);
    this.updateVisit = VisitController.prototype.updateVisit.bind(this);
}

VisitController.prototype.getVisitsOfPatient = function (req, res) {
    if (!req.query.hasOwnProperty('patientId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.visit.getVisit(req.query.patientId).then(function (result) {
        res.status(200).json(formatToJSON(result));
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
    this.visit.createVisit(req.user, req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return;
    });
};

VisitController.prototype.updateVisit = function (req, res) {
    if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.visit.updateVisit(req.user, req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
    });
};

VisitController.prototype.deleteVisit = function (req, res) {
    if (!req.body.hasOwnProperty('visitId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.visit.deleteVisit(req.user, req.body.visitId).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
    });
};

module.exports = VisitController;