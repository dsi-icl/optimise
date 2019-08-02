import { getEntry, createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import dbcon from '../utils/db-connection';

class VisitData {

    static getVisitData(whereObj) {
        return new Promise((resolve, reject) => getEntry('VISIT_DATA', whereObj, '*').then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static createVisitData(entryObj) {
        return new Promise((resolve, reject) => createEntry('VISIT_DATA', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    static updateVisitData(user, whereObj, newObj) {
        return new Promise((resolve, reject) => updateEntry('VISIT_DATA', user, '*', whereObj, newObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
    }

    static deleteVisitData(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('VISIT_DATA', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.deleteEntry, error))));
    }
}

class TestData {

    static getTestData(whereObj) {
        return new Promise((resolve, reject) => getEntry('TEST_DATA', whereObj, '*').then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static createTestData(entryObj) {
        return new Promise((resolve, reject) => createEntry('TEST_DATA', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    static updateTestData(user, whereObj, newObj) {
        return new Promise((resolve, reject) => updateEntry('TEST_DATA', user, '*', whereObj, newObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
    }

    static deleteTestData(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('TEST_DATA', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.deleteEntry, error))));
    }
}

class ClinicalEventsData {

    static getClinicalEventsData(whereObj) {
        return new Promise((resolve, reject) => getEntry('CLINICAL_EVENTS_DATA', whereObj, '*').then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static createClinicalEventsData(entryObj) {
        return new Promise((resolve, reject) => createEntry('CLINICAL_EVENTS_DATA', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
    }

    static updateClinicalEventsData(user, whereObj, newObj) {
        return new Promise((resolve, reject) => updateEntry('CLINICAL_EVENTS_DATA', user, '*', whereObj, newObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
    }

    static deleteClinicalEventsData(user, whereObj) {
        return new Promise((resolve, reject) => deleteEntry('CLINICAL_EVENTS_DATA', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.deleteEntry, error))));
    }
}

class Data {

    static deleteData({ id }, { dataTable, dataTableForeignKey }, idData, deleteObj) {
        return new Promise((resolve, reject) => {
            dbcon().transaction(trx => {
                dbcon()(dataTable)
                    .where('field', 'in', deleteObj)
                    .andWhere('deleted', '-')
                    .andWhere(dataTableForeignKey, idData)
                    .update({ 'deleted': `${id}@${(new Date()).getTime()}` })
                    .transacting(trx)
                    .then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error)))
                    .then(trx.commit)
                    .catch(trx.rollback);
            });
        });
    }
}

export default Data;
//export default = { VisitData: VisitData, TestData: TestData, ClinicalEventsData: ClinicalEventsData };