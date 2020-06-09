import { createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import messages from '../utils/message-utils';

class ConcomitantMed {
    static createConcomitantMed(entryObj) {
        return new Promise((resolve, reject) => createEntry('CONCOMITANT_MED', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static updateConcomitantMed(user, updatedObj) {
        return new Promise((resolve, reject) => updateEntry('CONCOMITANT_MED', user, '*', { 'id': updatedObj.id }, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }

    static deleteConcomitantMed(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('CONCOMITANT_MED', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
    }
}

export default ConcomitantMed;