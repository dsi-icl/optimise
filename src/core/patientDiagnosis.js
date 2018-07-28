const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

function PatientDiagnosis() {
    this.getPatientDiagnosis = PatientDiagnosis.prototype.getPatientDiagnosis.bind(this);
    this.createPatientDiagnosis = PatientDiagnosis.prototype.createPatientDiagnosis.bind(this);
    this.updatePatientDiagnosis = PatientDiagnosis.prototype.updatePatientDiagnosis.bind(this);
    this.deletePatientDiagnosis = PatientDiagnosis.prototype.deletePatientDiagnosis.bind(this);
}

PatientDiagnosis.prototype.getPatientDiagnosis = function (whereObj) {
    return new Promise(function (resolve, reject) {
        whereObj.deleted = '-';
        getEntry('PATIENT_DIAGNOSIS', whereObj, { id: 'id', patient: 'patient', diagnosis: 'diagnosis', diagnosisDate: 'diagnosisDate' }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

PatientDiagnosis.prototype.createPatientDiagnosis = function (entryObj) {
    return new Promise(function (resolve, reject) {
        createEntry('PATIENT_DIAGNOSIS', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

PatientDiagnosis.prototype.updatePatientDiagnosis = function (user, idDiagnosis, updatedObj) {
    return new Promise(function (resolve, reject) {
        updateEntry('PATIENT_DIAGNOSIS', user, '*', { id: idDiagnosis }, updatedObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

PatientDiagnosis.prototype.deletePatientDiagnosis = function (user, whereObj) {
    return new Promise(function (resolve, reject) {
        deleteEntry('PATIENT_DIAGNOSIS', user, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

module.exports = PatientDiagnosis;