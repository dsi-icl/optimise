import { getEntry, createEntry, deleteEntry, updateEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import dbcon from '../utils/db-connection';

class Treatment {
    static getTreatment(treatment) {
        return new Promise((resolve, reject) => getEntry('TREATMENTS', treatment, '*').then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.NOTFOUND, error))));
    }

    static createTreatment(treatment) {
        return new Promise((resolve, reject) => createEntry('TREATMENTS', treatment).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    static updateTreatment(user, idTreatment, updatedEntry) {
        return new Promise((resolve, reject) => updateEntry('TREATMENTS', user, '*', { id: idTreatment }, updatedEntry).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
    }

    static addTerminationDateTreatment(idTreatment, updateEntry) {
        return new Promise((resolve, reject) => dbcon()('TREATMENTS').where({ id: idTreatment }).update(updateEntry).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }

    static deleteTreatment(user, idTreatment) {
        return new Promise((resolve, reject) => deleteEntry('TREATMENTS', user, { id: idTreatment }).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }

    static addInterruption(__unused__user, interruption) {
        return new Promise((resolve, reject) => createEntry('TREATMENTS_INTERRUPTIONS', interruption).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    static updateInterruption(user, idInterruption, updatedEntry) {
        return new Promise((resolve, reject) => updateEntry('TREATMENTS_INTERRUPTIONS', user, '*', { id: idInterruption }, updatedEntry).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
    }

    static deleteInterruption(user, idInterruption) {
        return new Promise((resolve, reject) => deleteEntry('TREATMENTS_INTERRUPTIONS', user, { id: idInterruption }).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    static getReasons() {
        return new Promise((resolve, reject) => getEntry('REASONS', {}, '*').then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static searchReasons(reason) {
        return new Promise((resolve, reject) => dbcon()('REASONS').select('*').where('value', 'like', reason).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static getDrugs() {
        return new Promise((resolve, reject) => getEntry('AVAILABLE_DRUGS', {}, '*').then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static searchDrugs(drugSample) {
        return new Promise((resolve, reject) => dbcon()('AVAILABLE_DRUGS').select('*').where('name', 'like', drugSample).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }
}

export default Treatment;
