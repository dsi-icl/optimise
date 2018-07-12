const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');

function PatientPregnancyCore() {
    this.getPatientPregnancy = PatientPregnancyCore.prototype.getPatientPregnancy.bind(this);
    this.createPatientPregnancy = PatientPregnancyCore.prototype.createPatientPregnancy.bind(this);
    this.updatePatientPregnancy = PatientPregnancyCore.prototype.updatePatientPregnancy.bind(this);
    this.deletePatientPregnancy = PatientPregnancyCore.prototype.deletePatientPregnancy.bind(this);
}

PatientPregnancyCore.prototype.getPatientPregnancy = function (whereObj) {
    return new Promise(function (resolve, reject) {
        getEntry('PATIENT_PREGNANCY', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPregnancyCore.prototype.createPatientPregnancy = function (entryObj) {
    return new Promise(function (resolve, reject) {
        createEntry('PATIENT_PREGNANCY', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPregnancyCore.prototype.updatePatientPregnancy = function (requester, idPatient, updatedObj) {
    return new Promise(function (resolve, reject) {
        updateEntry('PATIENT_PREGNANCY', requester, '*', { 'patient': idPatient }, updatedObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPregnancyCore.prototype.deletePatientPregnancy = function (requester, whereObj) {
    return new Promise(function (resolve, reject) {
        deleteEntry('PATIENT_PREGNANCY', requester, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

module.exports = PatientPregnancyCore;