const { getEntry, createEntry, deleteEntry } = require('../utils/controller-utils');
const knex = require('../utils/db-connection');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { DemographicCore } = require('../core/demographic');

const patientModel = {
    aliasId: '',
    study: ''
};

/**
 * @description Patient Core allow to get, search, create and delete a patient
 */
function Patient() {
    this.demo = new DemographicCore();
    this.getPatient = Patient.prototype.getPatient.bind(this);
    this.searchPatients = Patient.prototype.searchPatients.bind(this);
    this.createPatient = Patient.prototype.createPatient.bind(this);
    this.deletePatient = Patient.prototype.deletePatient.bind(this);
}

Patient.prototype.getPatient = function (whereObj, selectedObj) {
    return new Promise(function (resolve, reject) {
        whereObj.deleted = '-';
        getEntry('PATIENTS', whereObj, selectedObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

/**
 * @description Search a patient from a 'like' query.
 * @returns Promise that contains the patient in the success callback and the error stack in the error callback
 * @param {string} query The aliasId of the patient seeking for
 */
Patient.prototype.searchPatients = function (queryid) {
    return new Promise(function (resolve, reject) {
        knex('PATIENTS')
            .select({ patientId: 'id' }, 'aliasId', 'study')
            .where('aliasId', 'like', queryid)
            .andWhere('PATIENTS.deleted', '-')
            .then(function (result) {
                resolve(result);
            }, function (error) {
                reject(ErrorHelper(message.errorMessages.GETFAIL, error));
            });
    });
};

/**
 * @description Create a new patient
 * @param {*} user  Information about the user
 * @param {*} patient The new created patient
 */
Patient.prototype.createPatient = function (user, patient) {
    return new Promise(function (resolve, reject) {
        let entryObj = Object.assign({}, patientModel, patient);
        createEntry('PATIENTS', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

/**
 * @function deletePatient delete an entry of Patient from an ID.
 *
 * @param {*} user Information about the user
 * @param {*} idObj ID of the entry that is going to be deleted
 */
Patient.prototype.deletePatient = function (user, idObj) {
    return new Promise(function (resolve, reject) {
        deleteEntry('PATIENTS', user, idObj).then(function (success) {
            resolve(success);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = Patient;