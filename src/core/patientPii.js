const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');

function PatientPii() {
    this.getPatientPii = PatientPii.prototype.getPatientPii.bind(this);
    this.createPatientPii = PatientPii.prototype.createPatientPii.bind(this);
    this.updatePatientPii = PatientPii.prototype.updatePatientPii.bind(this);
    this.deletePatientPii = PatientPii.prototype.deletePatientPii.bind(this);
}

PatientPii.prototype.getPatientPii = function (whereObj) {
    return new Promise((resolve, reject) => getEntry('PATIENT_PII', whereObj, { id: 'id', patient: 'patient', firstName: 'firstName', surname: 'surname', fullAddress: 'fullAddress', postcode: 'postcode' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
};

PatientPii.prototype.createPatientPii = function (entryObj) {
    return new Promise((resolve, reject) => createEntry('PATIENT_PII', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
};

PatientPii.prototype.updatePatientPii = function (user, id, updatedObj) {
    return new Promise((resolve, reject) => updateEntry('PATIENT_PII', user, '*', { 'id': id }, updatedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
};

PatientPii.prototype.deletePatientPii = function (user, whereObj) {
    return new Promise((resolve, reject) => deleteEntry('PATIENT_PII', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(messages.errorMessages.GETFAIL, error))));
};

module.exports = PatientPii;