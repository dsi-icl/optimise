const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
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
Patient.prototype.searchPatients = function (queryfield, queryvalue) {

    switch (queryfield) {
        case 'SEX':
            return new Promise(function (resolve, reject) {
                knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'PATIENT_DEMOGRAPHIC.gender')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .where('PATIENT_DEMOGRAPHIC.gender', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        resolve(result);
                    }, function (error) {
                        reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'EXTRT':
            return new Promise(function (resolve, reject) {
                knex('TREATMENTS')
                    .select('TREATMENTS.orderedDuringVisit', 'AVAILABLE_DRUGS.name', 'PATIENTS.aliasId')
                    .leftOuterJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .where('AVAILABLE_DRUGS.name', queryvalue)
                    .andWhere('TREATMENTS.deleted', '-')
                    .andWhere('VISITS.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        resolve(result);
                    }, function (error) {
                        reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'ETHNIC':
            return new Promise(function (resolve, reject) {
                knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'PATIENT_DEMOGRAPHIC.ethnicity')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .where('PATIENT_DEMOGRAPHIC.ethnicity', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        resolve(result);
                    }, function (error) {
                        reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'COUNTRY':
            return new Promise(function (resolve, reject) {
                knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .where('PATIENT_DEMOGRAPHIC.countryOfOrigin', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        resolve(result);
                    }, function (error) {
                        reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'DOMINANT':
            return new Promise(function (resolve, reject) {
                knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'PATIENT_DEMOGRAPHIC.dominantHand')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .where('PATIENT_DEMOGRAPHIC.dominantHand', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        resolve(result);
                    }, function (error) {
                        reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'MHTERM':
            return new Promise(function (resolve, reject) {
                knex('PATIENT_DIAGNOSIS')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'AVAILABLE_DIAGNOSES.value')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DIAGNOSIS.patient')
                    .leftOuterJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
                    .where('AVAILABLE_DIAGNOSES.value', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DIAGNOSIS.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        resolve(result);
                    }, function (error) {
                        reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        default:
            return new Promise(function (resolve, reject) {
                knex('PATIENTS')
                    .select({ patientId: 'id' }, 'aliasId', 'study', 'consent')
                    .where('aliasId', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        resolve(result);
                    }, function (error) {
                        reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
    }
};

/**
 * @description Create a new patient
 * @param {*} patient The new created patient
 */
Patient.prototype.createPatient = function (patient) {
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
 * @description Update a new patient
 * @param {*} user Information about the user
 * @param {*} patient The new created patient
 */
Patient.prototype.updatePatient = function (user, patientObj) {
    return new Promise(function (resolve, reject) {
        updateEntry('PATIENTS', user, '*', { id: patientObj.id }, patientObj).then(function (result) {
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