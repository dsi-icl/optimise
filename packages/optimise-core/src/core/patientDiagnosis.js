import { getEntry, createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';

class PatientDiagnosis {

    static getPatientDiagnosis(whereObj) {
        return new Promise((resolve, reject) => {
            whereObj.deleted = '-';
            return getEntry('PATIENT_DIAGNOSIS', whereObj, { id: 'id', patient: 'patient', diagnosis: 'diagnosis', diagnosisDate: 'diagnosisDate', deleted: 'deleted' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error)));
        });
    }

    static createPatientDiagnosis(entryObj) {
        return new Promise((resolve, reject) => createEntry('PATIENT_DIAGNOSIS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static updatePatientDiagnosis(user, idDiagnosis, updatedObj) {
        return new Promise((resolve, reject) => updateEntry('PATIENT_DIAGNOSIS', user, '*', { id: idDiagnosis }, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static deletePatientDiagnosis(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('PATIENT_DIAGNOSIS', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }
}

export default PatientDiagnosis;