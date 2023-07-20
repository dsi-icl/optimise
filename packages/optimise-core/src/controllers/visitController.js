import visitCore from '../core/visit';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import moment from 'moment';

/**
 * @class VisitController: Inspect entry body and user right before sending to core
 */
class VisitController {

    /**
     * @function createReport
     * @description Create a new report
     * @param {Object} req Request Object
     * @param {Object} res Response Object
     */
    static getVisitsOfPatient({ query }, res) {
        if (!query.hasOwnProperty('patientId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        visitCore.getVisit(query.patientId).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }

    static createVisit({ body, user }, res) {
        if (!body.hasOwnProperty('patientId') || !body.hasOwnProperty('visitDate')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        const momentVisit = moment(body.visitDate, moment.ISO_8601);
        if (!momentVisit.isValid() && body.visitDate !== null) {
            const msg = message.dateError[momentVisit.invalidAt()] !== undefined ? message.dateError[momentVisit.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        const entryObj = {};
        if (body.hasOwnProperty('visitDate') && body.visitDate !== null)
            entryObj.visitDate = momentVisit.valueOf();
        entryObj.patient = body.patientId;
        if (body.hasOwnProperty('type'))
            entryObj.type = body.type;
        entryObj.createdByUser = user.id;
        visitCore.createVisit(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static updateVisit({ body, user }, res) {
        let updatedObj = {};
        const whereObj = {};
        if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        const momentVisit = moment(body.visitDate, moment.ISO_8601);
        if (body.hasOwnProperty('visitDate') && body.visitDate !== null && !momentVisit.isValid()) {
            const msg = message.dateError[momentVisit.invalidAt()] !== undefined ? message.dateError[momentVisit.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        updatedObj = Object.assign(body);
        whereObj.id = body.id;
        if (body.hasOwnProperty('visitDate') && body.visitDate !== null)
            updatedObj.visitDate = momentVisit.valueOf();
        delete updatedObj.id;
        updatedObj.createdByUser = user.id;
        visitCore.updateVisit(user, whereObj, updatedObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static deleteVisit({ body, user }, res) {
        if (!body.hasOwnProperty('visitId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        visitCore.deleteVisit(user, body.visitId).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    }

    /**
     * @function getReportOfVisit
     * @description get report depending on the query
     * @param {Object} req Request Object
     * @param {Object} res Response Object
     */
    static getReportOfVisit({ query }, res) {
        const whereObj = {};
        if (query.hasOwnProperty('id')) {
            whereObj.visit = query.id;
        }
        visitCore.getReport(whereObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }

    /**
     * @function createReport
     * @description Create a new report
     * @param {Object} req Request Object
     * @param {Object} res Response Object
     */
    static createReport({ body, user }, res) {
        if (body.hasOwnProperty('visit') && body.hasOwnProperty('report') &&
            typeof body.visit === 'number' && typeof body.report === 'string') {
            const newEntry = {};
            newEntry.visit = body.visit;
            newEntry.report = body.report;
            newEntry.createdByUser = user.id;
            visitCore.createReport(newEntry).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        }
        else if (!(body.hasOwnProperty('visit') && body.hasOwnProperty('report'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    /**
     * @function updateReport
     * @description Update a new report
     * @param {Object} req Request Object
     * @param {Object} res Response Object
     */
    static updateReport({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            visitCore.updateReport(user, body).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
    }

    /**
     * @function deleteReport
     * @description Delete a new report
     * @param {Object} req Request Object
     * @param {Object} res Response Object
     */
    static deleteReport({ user, body }, res) {
        if (user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            visitCore.deleteReport(user, body.id).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }
}

export default VisitController;