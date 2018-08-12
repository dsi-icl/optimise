const SelectorUtils = require('../utils/selector-utils');
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
    this.getPatientProfile = Patient.prototype.getPatientProfile.bind(this);
    this.getPatient = Patient.prototype.getPatient.bind(this);
    this.searchPatients = Patient.prototype.searchPatients.bind(this);
    this.createPatient = Patient.prototype.createPatient.bind(this);
    this.deletePatient = Patient.prototype.deletePatient.bind(this);
}

Patient.prototype.getPatient = function (whereObj, selectedObj) {
    return new Promise((resolve, reject) => {
        whereObj.deleted = '-';
        return getEntry('PATIENTS', whereObj, selectedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error)));
    });
};

/**
 * @function getPatientProfile
 * @description Return patient information (demographic / visit / etc... )
 * @param {Object} whereObj where closure for query
 * @param {Boolean} deleted True to look for not deleted entries. False for also deleted ones.
 * @param {string} getOnly Filtering return.
 */
Patient.prototype.getPatientProfile = function (whereObj, deleted, getOnly) {
    return new Promise((resolve, reject) => Patient.prototype.getPatient(whereObj, { patientId: 'id', alias: 'aliasId', study: 'study', consent: 'consent' })
        .then((Patientresult) => {
            let patientId;
            if (Patientresult.length === 1) {
                patientId = Patientresult[0].patientId;
            } else {
                return reject(ErrorHelper(message.errorMessages.NOTFOUND));
            }
            let promiseArr = [];
            let availableFunctions = ['getDemographicData', 'getImmunisations', 'getMedicalHistory', 'getVisits', 'getTests', 'getTreatments', 'getClinicalEvents', 'getPregnancy', 'getDiagnosis'];

            if (getOnly && typeof getOnly === 'string')
                availableFunctions = getOnly.split(',').filter((func) => availableFunctions.includes(func));

            for (let i = 0; i < availableFunctions.length; i++) {
                promiseArr.push(SelectorUtils[availableFunctions[i]](patientId, deleted));
            }
            let selectorPromises = Promise.all(promiseArr);
            selectorPromises.then((result) => {
                const responseObj = {};
                responseObj.patientId = Patientresult[0].alias;
                responseObj.id = patientId;
                responseObj.consent = Boolean(Patientresult[0].consent);
                for (let i = 0; i < result.length; i++) {
                    responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
                }
                return resolve(responseObj);
            }).catch((error) => reject(ErrorHelper(message.errorMessages.NOTFOUND, error)));
            return true;
        }).catch((error) => reject(ErrorHelper(message.errorMessages.NOTFOUND, error))));
};

/**
 * @description Search a patient from a 'like' query.
 * @returns Promise that contains the patient in the success callback and the error stack in the error callback
 * @param {string} query The aliasId of the patient seeking for
 */
Patient.prototype.searchPatients = function (queryfield, queryvalue) {

    switch (queryfield) {
        case 'OPTIMISEID':
            return new Promise((resolve, reject) => knex('PATIENTS')
                .select({ patientId: 'id' }, 'aliasId', 'uuid', 'study', 'consent')
                .where('uuid', 'like', `%${queryvalue}%`)
                .andWhere('PATIENTS.deleted', '-')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
        case 'SEX':
            return new Promise((resolve, reject) => knex('PATIENT_DEMOGRAPHIC')
                .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'GENDERS.value')
                .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                .leftOuterJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
                .where('GENDERS.value', `${queryvalue.trim().toLowerCase()}`)
                .andWhere('PATIENTS.deleted', '-')
                .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
        case 'EXTRT':
            return new Promise((resolve, reject) => knex('TREATMENTS')
                .select('TREATMENTS.orderedDuringVisit', 'AVAILABLE_DRUGS.name', 'PATIENTS.aliasId', 'PATIENTS.consent', 'PATIENTS.study')
                .leftOuterJoin('VISITS', 'VISITS.id', 'TREATMENTS.orderedDuringVisit')
                .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'VISITS.patient')
                .leftOuterJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
                .where('AVAILABLE_DRUGS.name', 'like', `%${queryvalue}%`)
                .andWhere('TREATMENTS.deleted', '-')
                .andWhere('VISITS.deleted', '-')
                .andWhere('PATIENTS.deleted', '-')
                .groupBy('PATIENTS.aliasId')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
        case 'ETHNIC':
            return new Promise((resolve, reject) => knex('PATIENT_DEMOGRAPHIC')
                .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'ETHNICITIES.value')
                .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                .leftOuterJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
                .where('ETHNICITIES.value', 'like', `%${queryvalue}%`)
                .andWhere('PATIENTS.deleted', '-')
                .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
        case 'COUNTRY':
            return new Promise((resolve, reject) => knex('PATIENT_DEMOGRAPHIC')
                .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'COUNTRIES.value')
                .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                .leftOuterJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
                .where('COUNTRIES.value', 'like', `%${queryvalue}%`)
                .andWhere('PATIENTS.deleted', '-')
                .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
        case 'DOMINANT':
            return new Promise((resolve, reject) => knex('PATIENT_DEMOGRAPHIC')
                .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'DOMINANT_HANDS.value')
                .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
                .leftOuterJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
                .where('DOMINANT_HANDS.value', 'like', `%${queryvalue}%`)
                .andWhere('PATIENTS.deleted', '-')
                .andWhere('PATIENT_DEMOGRAPHIC.deleted', '-')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
        case 'MHTERM':
            return new Promise((resolve, reject) => knex('PATIENT_DIAGNOSIS')
                .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENTS.consent', 'AVAILABLE_DIAGNOSES.value')
                .leftOuterJoin('PATIENTS', 'PATIENTS.id', 'PATIENT_DIAGNOSIS.patient')
                .leftOuterJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
                .where('AVAILABLE_DIAGNOSES.value', 'like', `%${queryvalue}%`)
                .andWhere('PATIENTS.deleted', '-')
                .andWhere('PATIENT_DIAGNOSIS.deleted', '-')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
        default:
            return new Promise((resolve, reject) => knex('PATIENTS')
                .select({ patientId: 'id' }, 'aliasId', 'uuid', 'study', 'consent')
                .where('aliasId', 'like', `%${queryvalue}%`)
                .andWhere('PATIENTS.deleted', '-')
                .then((result) => {
                    if (Array.isArray(result))
                        for (let i = 0; i < result.length; i++) {
                            result[i].consent = Boolean(result[i].consent);
                        }
                    return resolve(result);
                }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }
};

/**
 * @description Create a new patient
 * @param {*} patient The new created patient
 */
Patient.prototype.createPatient = function (patient) {
    return new Promise((resolve, reject) => {
        let entryObj = Object.assign({}, patientModel, patient);
        entryObj.uuid = uuid();
        return createEntry('PATIENTS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error)));
    });
};

/**
 * @description Update a new patient
 * @param {*} user Information about the user
 * @param {*} patient The new created patient
 */
Patient.prototype.updatePatient = function (user, patientObj) {
    return new Promise((resolve, reject) => updateEntry('PATIENTS', user, '*', { id: patientObj.id }, patientObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

/**
 * @function deletePatient delete an entry of Patient from an ID.
 *
 * @param {*} user Information about the user
 * @param {*} idObj ID of the entry that is going to be deleted
 */
Patient.prototype.deletePatient = function (user, idObj) {
    return new Promise((resolve, reject) => deleteEntry('PATIENTS', user, idObj).then((success) => resolve(success)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
};

module.exports = Patient;