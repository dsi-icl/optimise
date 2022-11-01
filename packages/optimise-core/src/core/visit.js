import { getEntry, createEntry, deleteEntry, updateEntry } from '../utils/controller-utils';
import message from '../utils/message-utils';
import ErrorHelper from '../utils/error_helper';
import dbcon from '../utils/db-connection';

/**
 * @description class that contain method for creating, getting, updating and deleting visits and their report
 */
class Visit {

    /**
     * @function getVisit
     * @description return a visit linked to a patient
     * @param {Object} patientInfo alias of the patient targeted for the visit
     */
    static getVisit(patientInfo) {
        return new Promise((resolve, reject) => dbcon()('PATIENTS')
            .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', { visitId: 'VISITS.id' }, 'VISITS.communication', 'VISITS.visitDate', 'VISITS.type')
            .leftOuterJoin('VISITS', 'PATIENTS.id', 'VISITS.patient')
            .where({ 'PATIENTS.aliasId': patientInfo, 'VISITS.deleted': '-' })
            .then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    /**
     * @function createVisit
     * @description Create a visit
     * @param {Object} user Object that contain the id of the user doing the request
     * @param {Object} visit The new entry
     */
    static createVisit(entryObj) {
        return new Promise((resolve, reject) => createEntry('VISITS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    /**
     * @function updatedObj
     * @description Update a visit
     * @param {Object} user Object that contain the id of the user doing the request
     * @param {Object} updatedObj the new entry that will replace the old one
     */

    static updateVisit(user, whereObj, updatedObj) {
        return new Promise((resolve, reject) => updateEntry('VISITS', user, '*', whereObj, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    /**
     * @function deleteVisit
     * @description Set as deleted a visit
     * @param {Object} user Object that contain the id of the user doing the request
     * @param {integer} visitId
     */
    static deleteVisit(user, visitId) {
        return new Promise((resolve, reject) => deleteEntry('VISITS', user, { id: visitId }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }

    /**
     * @function getReport
     * @description Return either all report or just a report relative to a giving visit ID.
     * @param {Object} whereObj Either empty or containing a field visit that represent the id of the visit.
     */
    static getReport(whereObj) {
        return new Promise((resolve, reject) => getEntry('VISIT_REPORT', whereObj, { id: 'id', report: 'report', visit: 'visit' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    /**
     * @function createReport
     * @description Create a new report
     * @param {Object} entryObj the new report entry
     */
    static createReport(entryObj) {
        return new Promise((resolve, reject) => createEntry('VISIT_REPORT', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    /**
     * @function updateReport
     * @description Update a report
     * @param {Object} user Object that contain the id of the user doing the request
     * @param {Object} updatedObj the report edited
     */
    static updateReport(user, updatedObj) {
        return new Promise((resolve, reject) => {
            const whereObj = {};
            whereObj.id = updatedObj.id;
            delete updatedObj.id;
            return updateEntry('VISIT_REPORT', user, '*', whereObj, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error)));
        });
    }

    /**
     * @function deleteReport
     * @description Set as Deleted the given report
     * @param {Object} user Object that contain the id of the user doing the request
     * @param {integer} deleteObj the ID of the report to delete
     */
    static deleteReport(user, deleteObj) {
        return new Promise((resolve, reject) => deleteEntry('VISIT_REPORT', user, { id: deleteObj }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }
}

export default Visit;