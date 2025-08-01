import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import { createEntry, updateEntry, deleteEntry, getEntry } from '../utils/controller-utils';

class Test {
    static getTest(whereObj) {
        return new Promise((resolve, reject) => getEntry('ORDERED_TESTS', whereObj, '*').then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static createTest(entryObj) {
        return new Promise((resolve, reject) => createEntry('ORDERED_TESTS', entryObj).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    static updateTest(user, entryTest) {
        return new Promise((resolve, reject) => updateEntry('ORDERED_TESTS', user, '*', { id: entryTest.id }, entryTest).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
    }

    static deleteTest(requester, idTest) {
        return new Promise((resolve, reject) => deleteEntry('ORDERED_TESTS', requester, idTest).then(result => resolve(result)).catch(error => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }
}

export default Test;
