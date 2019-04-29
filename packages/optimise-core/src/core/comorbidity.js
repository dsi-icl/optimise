import { getEntry, createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import messages from '../utils/message-utils';

class Comorbidity {

    static getComorbidity(whereObj) {
        return new Promise((resolve, reject) => getEntry('ICD11', whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static createComorbidity(entryObj) {
        return new Promise((resolve, reject) => createEntry('ICD11', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static updateComorbidity(user, id, updatedObj) {
        return new Promise((resolve, reject) => updateEntry('ICD11', user, '*', { 'id': id }, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static deleteComorbidity(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('ICD11', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }
}

export default Comorbidity;