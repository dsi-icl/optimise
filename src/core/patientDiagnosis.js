const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');

function PatientDiagnosisCore() {
    this.getPatientDiagnosis = PatientDiagnosisCore.prototype.getPatientDiagnosis.bind(this);
    this.createPatientDiagnosis = PatientDiagnosisCore.prototype.createPatientDiagnosis.bind(this);
    this.updatePatientDiagnosis = PatientDiagnosisCore.prototype.updatePatientDiagnosis.bind(this);
    this.deletePatientDiagnosis = PatientDiagnosisCore.prototype.deletePatientDiagnosis.bind(this);
}

PatientDiagnosisCore.prototype.getPatientDiagnosis = function (whereObj) {
    return new Promise(function (resolve, reject) {
        getEntry('PATIENT_DIAGNOSIS', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientDiagnosisCore.prototype.createPatientDiagnosis = function (entryObj) {
    return new Promise(function (resolve, reject) {
        createEntry('PATIENT_DIAGNOSIS', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientDiagnosisCore.prototype.updatePatientDiagnosis = function (user, idPatient, updatedObj) {
    return new Promise(function (resolve, reject) {
        updateEntry('PATIENT_DIAGNOSIS', user, '*', { 'patient': idPatient }, updatedObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientDiagnosisCore.prototype.deletePatientDiagnosis = function (user, whereObj) {
    return new Promise(function (resolve, reject) {
        deleteEntry('PATIENT_DIAGNOSIS', user, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

module.exports = PatientDiagnosisCore;