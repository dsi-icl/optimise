const visitCore = require('../core/visit');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');

/**
 * @class VisitController: Inspect entry body and user right before sending to core
 */
function VisitController() {
    this.visit = new visitCore();

    this.getVisitsOfPatient = VisitController.prototype.getVisitsOfPatient.bind(this);
    this.createVisit = VisitController.prototype.createVisit.bind(this);
    this.deleteVisit = VisitController.prototype.deleteVisit.bind(this);
    this.updateVisit = VisitController.prototype.updateVisit.bind(this);
    this.getReportOfVisit = VisitController.prototype.getReportOfVisit.bind(this);
    this.createReport = VisitController.prototype.createReport.bind(this);
    this.deleteReport = VisitController.prototype.deleteReport.bind(this);
    this.updateReport = VisitController.prototype.updateReport.bind(this);
}

/**
 * @function createReport
 * @description Create a new report
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */VisitController.prototype.getVisitsOfPatient = function (req, res) {
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

/**
 * @function getReportOfVisit
 * @description get report depending on the query
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
VisitController.prototype.getReportOfVisit = function (req, res) {
    let whereObj = {};
    if (req.query.hasOwnProperty('id')) {
        whereObj.visit = req.query.id;
    }
    this.visit.getReport(whereObj).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

/**
 * @function createReport
 * @description Create a new report
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
VisitController.prototype.createReport = function (req, res) {
    if (req.body.hasOwnProperty('visit') && req.body.hasOwnProperty('report') &&
        typeof req.body.visit === 'number' && typeof req.body.report === 'string') {
        let newEntry = {};
        newEntry.visit = req.body.visit;
        newEntry.report = req.body.report;
        newEntry.createdByUser = req.user.id;
        this.visit.createReport(newEntry).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    }
    else if (!(req.body.hasOwnProperty('visit') && req.body.hasOwnProperty('report'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

/**
 * @function updateReport
 * @description Update a new report
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
VisitController.prototype.updateReport = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.visit.updateReport(req.user, req.body).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

/**
 * @function deleteReport
 * @description Delete a new report
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 */
VisitController.prototype.deleteReport = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.visit.deleteReport(req.user, req.body.id).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

module.exports = VisitController;