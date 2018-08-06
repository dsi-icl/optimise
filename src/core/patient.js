const uuid = require('uuid/v4');
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
        return getEntry('PATIENTS', whereObj, selectedObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
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
        case 'OPTIMISEID':
            return new Promise(function (resolve, reject) {
                return knex('PATIENTS')
                    .select({ patientId: 'id' }, 'aliasId', 'uuid', 'study', 'consent')
                    .where('uuid', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'SEX':
            return new Promise(function (resolve, reject) {
                return knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'GENDERS.value')
                    .leftOuterJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .where('GENDERS.value', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'EXTRT':
            return new Promise(function (resolve, reject) {
                return knex('TREATMENTS')
                    .select('TREATMENTS.orderedDuringVisit', 'AVAILABLE_DRUGS.name', 'PATIENTS.aliasId')
                    .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                    .leftOuterJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
                    .where('AVAILABLE_DRUGS.name', 'like', queryvalue)
                    .andWhere('TREATMENTS.deleted', '-')
                    .andWhere('VISITS.deleted', '-')
                    .andWhere('PATIENTS.deleted', '-')
                    .groupBy('PATIENTS.aliasId')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'ETHNIC':
            return new Promise(function (resolve, reject) {
                return knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'ETHNICITIES.value')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .leftOuterJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
                    .where('ETHNICITIES.value', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'COUNTRY':
            return new Promise(function (resolve, reject) {
                return knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'COUNTRIES.value')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .leftOuterJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
                    .where('COUNTRIES.value', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'DOMINANT':
            return new Promise(function (resolve, reject) {
                return knex('PATIENT_DEMOGRAPHIC')
                    .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'DOMINANT_HANDS.value')
                    .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                    .leftOuterJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
                    .where('DOMINANT_HANDS.value', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        case 'MHTERM':
            return new Promise(function (resolve, reject) {
                return knex('PATIENT_DIAGNOSIS')
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
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
                    });
            });
        default:
            return new Promise(function (resolve, reject) {
                return knex('PATIENTS')
                    .select({ patientId: 'id' }, 'aliasId', 'uuid', 'study', 'consent')
                    .where('aliasId', 'like', queryvalue)
                    .andWhere('PATIENTS.deleted', '-')
                    .then(function (result) {
                        if (Array.isArray(result))
                            for (let i = 0; i < result.length; i++) {
                                result[i].consent = Boolean(result[i].consent);
                            }
                        return resolve(result);
                    }).catch(function (error) {
                        return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
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
        entryObj.uuid = uuid();
        return createEntry('PATIENTS', entryObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
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
        return updateEntry('PATIENTS', user, '*', { id: patientObj.id }, patientObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
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
        return deleteEntry('PATIENTS', user, idObj).then(function (success) {
            return resolve(success);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = Patient;