const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');

function PatientPiiCore() {
    this.getPatientPii = PatientPiiCore.prototype.getPatientPii.bind(this);
    this.createPatientPii = PatientPiiCore.prototype.createPatientPii.bind(this);
    this.updatePatientPii = PatientPiiCore.prototype.updatePatientPii.bind(this);
    this.deletePatientPii = PatientPiiCore.prototype.deletePatientPii.bind(this);
}

PatientPiiCore.prototype.getPatientPii = function (whereObj) {
    return new Promise(function (resolve, reject) {
        getEntry('PATIENT_PII', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPiiCore.prototype.createPatientPii = function (entryObj) {
    return new Promise(function (resolve, reject) {
        createEntry('PATIENT_PII', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPiiCore.prototype.updatePatientPii = function (requester, idPatient, updatedObj) {
    return new Promise(function (resolve, reject) {
        updateEntry('PATIENT_PII', requester, '*', { 'patient': idPatient }, updatedObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPiiCore.prototype.deletePatientPii = function (requester, whereObj) {
    return new Promise(function (resolve, reject) {
        deleteEntry('PATIENT_PII', requester, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

module.exports = PatientPiiCore;