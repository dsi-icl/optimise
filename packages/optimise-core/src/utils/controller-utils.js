const knex = require('../utils/db-connection');
const message = require('../utils/message-utils');
const ErrorHelper = require('../utils/error_helper');

function createEntry(tablename, entryObj) {
    return new Promise((resolve, reject) => {
        knex(tablename).insert(entryObj).then((result) => resolve(result)).catch((error) => reject(error));
    });
}

function deleteEntry(tablename, user, whereObj) {
    whereObj.deleted = '-';
    return new Promise((resolve, reject) => {
        knex(tablename).where(whereObj).update({ deleted: `${user.id}@${JSON.stringify(new Date())}` }).then((result) => resolve(result)).catch((error) => reject(error));
    });
}

function getEntry(tablename, whereObj, selectedObj) {
    return new Promise((resolve, reject) => {
        knex(tablename).select(selectedObj).where(whereObj).then((result) => resolve(result)).catch((error) => reject(error));
    });
}

function updateEntry(tablename, user, originObj, whereObj, newObj) {
    whereObj.deleted = '-';
    return new Promise((resolve, reject) => getEntry(tablename, whereObj, originObj)
        .then((getResult) => {
            if (getResult.length !== 1) {
                return reject(message.errorMessages.NOTFOUND);
            }
            let oldEntry = getResult[0];
            delete oldEntry.id;
            if (oldEntry.hasOwnProperty('deleted'))
                oldEntry.deleted = `${user.id}@${new Date().getTime()}`;
            if (oldEntry.hasOwnProperty('createdTime'))
                newObj.createdTime = knex.fn.now();
            return oldEntry;
        })
        .then(oldEntry => createEntry(tablename, oldEntry))
        .then(__unused__createResult => knex(tablename)
            .update(newObj)
            .where(whereObj))
        .then(updateRes => resolve(updateRes))
        .catch(error => reject(error)));
}

function eraseEntry(tablename, whereObj) {
    return knex(tablename)
        .del()
        .where(whereObj);
}

function searchEntry(queryfield, queryvalue) {
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

}

module.exports = { getEntry: getEntry, createEntry: createEntry, updateEntry: updateEntry, deleteEntry: deleteEntry, eraseEntry: eraseEntry, searchEntry: searchEntry };