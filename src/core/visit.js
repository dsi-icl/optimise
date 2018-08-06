const { getEntry, createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');
const message = require('../utils/message-utils');
const ErrorHelper = require('../utils/error_helper');
const knex = require('../utils/db-connection');

/**
 * @description class that contain method for creating, getting, updating and deleting visits and their report
 */
function Visit() {
    //Visit part
    this.getVisit = Visit.prototype.getVisit.bind(this);
    this.creteVisit = Visit.prototype.createVisit.bind(this);
    this.updateVisit = Visit.prototype.updateVisit.bind(this);
    this.deleteVisit = Visit.prototype.deleteVisit.bind(this);
    //Report part
    this.getReport = Visit.prototype.getReport.bind(this);
    this.creteReport = Visit.prototype.createReport.bind(this);
    this.updateReport = Visit.prototype.updateReport.bind(this);
    this.deleteReport = Visit.prototype.deleteReport.bind(this);
}

/**
 * @function getVisit
 * @description return a visit linked to a patient
 * @param {Object} patientInfo alias of the patient targeted for the visit
 */
Visit.prototype.getVisit = function (patientInfo)  {
    return new Promise((resolve, reject) => knex('PATIENTS')
        .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', { visitId: 'VISITS.id' }, 'VISITS.communication', 'VISITS.visitDate', 'VISITS.type')
        .leftOuterJoin('VISITS', 'PATIENTS.id', 'VISITS.patient')
        .where({ 'PATIENTS.aliasId': patientInfo, 'VISITS.deleted': '-' })
        .then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};

/**
 * @function createVisit
 * @description Create a visit
 * @param {Object} user Object that contain the id of the user doing the request
 * @param {Object} visit The new entry
 */
Visit.prototype.createVisit = function (entryObj)  {
    return new Promise((resolve, reject) => createEntry('VISITS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

/**
 * @function updatedObj
 * @description Update a visit
 * @param {Object} user Object that contain the id of the user doing the request
 * @param {Object} updatedObj the new entry that will replace the old one
 */

Visit.prototype.updateVisit = function (user, whereObj, updatedObj)  {
    return new Promise((resolve, reject) => updateEntry('VISITS', user, '*', whereObj, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};

/**
 * @function deleteVisit
 * @description Set as deleted a visit
 * @param {Object} user Object that contain the id of the user doing the request
 * @param {integer} visitId
 */
Visit.prototype.deleteVisit = function (user, visitId)  {
    return new Promise((resolve, reject) => deleteEntry('VISITS', user, { id: visitId }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
};

/**
 * @function getReport
 * @description Return either all report or just a report relative to a giving visit ID.
 * @param {Object} whereObj Either empty or containing a field visit that represent the id of the visit.
 */
Visit.prototype.getReport = function (whereObj)  {
    return new Promise((resolve, reject) => getEntry('VISIT_REPORT', whereObj, { id: 'id', report: 'report', visit: 'visit' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};

/**
 * @function createReport
 * @description Create a new report
 * @param {Object} entryObj the new report entry
 */
Visit.prototype.createReport = function (entryObj)  {
    return new Promise((resolve, reject) => createEntry('VISIT_REPORT', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

/**
 * @function updateReport
 * @description Update a report
 * @param {Object} user Object that contain the id of the user doing the request
 * @param {Object} updatedObj the report edited
 */
Visit.prototype.updateReport = function (user, updatedObj)  {
    return new Promise((resolve, reject) => {
        let whereObj = {};
        whereObj.id = updatedObj.id;
        delete updatedObj.id;
        return updateEntry('VISIT_REPORT', user, '*', whereObj, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error)));
    });
};

/**
 * @function deleteReport
 * @description Set as Deleted the given report
 * @param {Object} user Object that contain the id of the user doing the request
 * @param {integer} deleteObj the ID of the report to delete
 */
Visit.prototype.deleteReport = function (user, deleteObj)  {
    return new Promise((resolve, reject) => deleteEntry('VISIT_REPORT', user, { id: deleteObj }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
};

module.exports = Visit;