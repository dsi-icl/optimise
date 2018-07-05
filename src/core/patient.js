const { getEntry, createEntry, deleteEntry } = require('../utils/controller-utils');
const knex = require('../utils/db-connection');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

const patientModel = {
    aliasId: '',
    study: ''
};

function Patient() {
    this.getPatient = Patient.prototype.getPatient.bind(this);
    this.searchPatients = Patient.prototype.searchPatients.bind(this);
    this.createPatient = Patient.prototype.createPatient.bind(this);
    this.deletePatient = Patient.prototype.deletePatient.bind(this);
}

Patient.prototype.getPatient = function(selectObj, whereObj) {
    return new Promise(function (resolve, reject) {
        getEntry('PATIENTS', whereObj, selectObj).then(function(result) {
            resolve(result);
        }, function(error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

/**
 *
 * @param {*} query
 */
Patient.prototype.searchPatients = function(queryid) {
    return new Promise(function(resolve, reject){
        knex('PATIENTS')
            .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENT_DEMOGRAPHIC.DOB', 'PATIENT_DEMOGRAPHIC.gender')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .where('PATIENTS.aliasId', 'like', queryid)
            .andWhere('PATIENTS.deleted', '-')
            .then(function(result){
                resolve(result);
            }, function(error) {
                reject(ErrorHelper(message.errorMessages.GETFAIL, error));
            });
    });
};

Patient.prototype.createPatient = function(requester, patient) {
    return new Promise(function (resolve, reject) {
        let entryObj = Object.assign({}, patientModel, patient);
        entryObj.createdByUser = requester.userid;
        createEntry('PATIENTS', entryObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

/**
 * @function deletePatient delete an entry of Patient from an ID.
 *
 * @param {*} requester Information about the requester
 * @param {*} idObj ID of the entry that is going to be deleted
 */
Patient.prototype.deletePatient = function(requester, idObj) {
    return new Promise(function(resolve, reject) {
        deleteEntry('PATIENTS', requester, idObj).then(function (success) {
            resolve(success);
        }, function(error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = Patient;