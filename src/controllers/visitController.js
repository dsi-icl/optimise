const visitCore = require('../core/visit');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const moment = require('moment');

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
    this.visit.getVisit(req.query.patientId).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return false;
    });
};

VisitController.prototype.createVisit = function (req, res) {
    if (!req.body.hasOwnProperty('patientId') || !req.body.hasOwnProperty('visitDate')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    let momentVisit = moment(req.body.visitDate, moment.ISO_8601);
    if (!momentVisit.isValid() && req.body.visitDate !== null) {
        let msg = message.dateError[momentVisit.invalidAt()] !== undefined ? message.dateError[momentVisit.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    }
    let entryObj = {};
    if (req.body.hasOwnProperty('visitDate') && req.body.visitDate !== null)
        entryObj.visitDate = momentVisit.valueOf();
    entryObj.patient = req.body.patientId;
    if (req.body.hasOwnProperty('type'))
        entryObj.type = req.body.type;
    entryObj.createdByUser = req.user.id;
    this.visit.createVisit(entryObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return false;
    });
};

VisitController.prototype.updateVisit = function (req, res) {
    let updatedObj = {};
    let whereObj = {};
    if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    let momentVisit = moment(req.body.visitDate, moment.ISO_8601);
    if (req.body.hasOwnProperty('visitDate') && req.body.visitDate !== null && !momentVisit.isValid()) {
        let msg = message.dateError[momentVisit.invalidAt()] !== undefined ? message.dateError[momentVisit.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    }
    updatedObj = Object.assign(req.body);
    whereObj.id = req.body.id;
    if (req.body.hasOwnProperty('visitDate') && req.body.visitDate !== null)
        updatedObj.visitDate = momentVisit.valueOf();
    delete updatedObj.id;
    updatedObj.createdByUser = req.user.id;
    this.visit.updateVisit(req.user, whereObj, updatedObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        return false;
    });
};

VisitController.prototype.deleteVisit = function (req, res) {
    if (!req.body.hasOwnProperty('visitId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.visit.deleteVisit(req.user, req.body.visitId).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        return false;
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
    this.visit.getReport(whereObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return false;
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
        this.visit.createReport(newEntry).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
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
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.visit.updateReport(req.user, req.body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    } else if (req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
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
        this.visit.deleteReport(req.user, req.body.id).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
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