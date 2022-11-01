import { getEntry, createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';

const ClinicalEventModel = {
    patient: null,
    recordedDuringVisit: null,
    type: 0,
    dateStartDate: '',
    endDate: null
};

class ClinicalEvent {

    /**
     * @function getClinicalEvent retrieve the clinical event wished.
     *
     * @returns a Promise that contains the result from the select query
     */
    static getClinicalEvent(requestedObj) {
        return new Promise((resolve, reject) => getEntry('CLINICAL_EVENTS', requestedObj, '*').then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    /**
     * @function createClinicalEvent add a new entry of clinicalEvent
     *
     * @param {user} user Information about the user
     * @param {ClinicalEventModel} ce The added clinicalEvent
     *
     * @returns a new Promise
     */
    static createClinicalEvent(ce) {
        return new Promise((resolve, reject) => {
            const entryObj = Object.assign({}, ClinicalEventModel, ce);
            return createEntry('CLINICAL_EVENTS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error)));
        });
    }

    /**
     * @function updateClinicalEvent delete an entry of clinicalEvent from an ID.
     *
     * @param {*} user Information about the user
     * @param {*} idObj ID of the entry that is going to be deleted
     */
    static updateClinicalEvent(user, clinicalEvent) {
        return new Promise((resolve, reject) => updateEntry('CLINICAL_EVENTS', user, '*', { id: clinicalEvent.id }, clinicalEvent).then((success) => resolve(success)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }

    /**
     * @function deleteClinicalEvent delete an entry of clinicalEvent from an ID.
     *
     * @param {*} user Information about the user
     * @param {*} idObj ID of the entry that is going to be deleted
     */
    static deleteClinicalEvent(user, idObj) {
        return new Promise((resolve, reject) => deleteEntry('CLINICAL_EVENTS', user, idObj).then((success) => resolve(success)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }
}

export default ClinicalEvent;