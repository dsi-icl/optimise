import { getEntry, createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import messages from '../utils/message-utils';

class Comorbidity {
    static getComorbidity(whereObj) {
        return new Promise((resolve, reject) => getEntry('COMORBIDITY', whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static createComorbidity(entryObj) {
        return new Promise((resolve, reject) => createEntry('COMORBIDITY', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static updateComorbidity(user, updatedObj) {
        return new Promise((resolve, reject) => updateEntry('COMORBIDITY', user, '*', { id: updatedObj.id }, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static deleteComorbidity(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('COMORBIDITY', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }
}

export default Comorbidity;