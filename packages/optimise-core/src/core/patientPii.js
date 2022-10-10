import { getEntry, createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import messages from '../utils/message-utils';

class PatientPii {

    static getPatientPii(whereObj) {
        return new Promise((resolve, reject) => getEntry('PATIENT_PII', whereObj, { id: 'id', patient: 'patient', firstName: 'firstName', surname: 'surname', fullAddress: 'fullAddress', postcode: 'postcode' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static createPatientPii(entryObj) {
        return new Promise((resolve, reject) => createEntry('PATIENT_PII', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static updatePatientPii(user, id, updatedObj) {
        return new Promise((resolve, reject) => updateEntry('PATIENT_PII', user, '*', { id: id }, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static deletePatientPii(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('PATIENT_PII', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }
}

export default PatientPii;