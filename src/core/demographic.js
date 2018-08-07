const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { getEntry, createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');

function Demographic() {
    this.getDemographic = Demographic.prototype.getDemographic.bind(this);
    this.editDemographic = Demographic.prototype.editDemographic.bind(this);
    this.createDemographic = Demographic.prototype.createDemographic.bind(this);
    this.deleteDemographic = Demographic.prototype.deleteDemographic.bind(this);
    this.getSmokingFields = Demographic.prototype.getSmokingFields.bind(this);
    this.getAlcoholUsageFields = Demographic.prototype.getAlcoholUsageFields.bind(this);
    this.getCountryFields = Demographic.prototype.getCountryFields.bind(this);
    this.getEthnicityFields = Demographic.prototype.getEthnicityFields.bind(this);
    this.getDominantHandsFields = Demographic.prototype.getDominantHandsFields.bind(this);
    this.getGenderFields = Demographic.prototype.getGenderFields.bind(this);
}

function MedicalHistory() {
    this.getMedicalHistory = MedicalHistory.prototype.getMedicalHistory.bind(this);
    this.editMedicalHistory = MedicalHistory.prototype.editMedicalHistory.bind(this);
    this.createMedicalHistory = MedicalHistory.prototype.createMedicalHistory.bind(this);
    this.deleteMedicalHistory = MedicalHistory.prototype.deleteMedicalHistory.bind(this);
    this.getRelations = MedicalHistory.prototype.getRelations.bind(this);
    this.getConditions = MedicalHistory.prototype.getConditions.bind(this);
}

function Immunisation() {
    this.getImmunisation = Immunisation.prototype.getImmunisation.bind(this);
    this.editImmunisation = Immunisation.prototype.editImmunisation.bind(this);
    this.createImmunisation = Immunisation.prototype.createImmunisation.bind(this);
    this.deleteImmunisation = Immunisation.prototype.deleteImmunisation.bind(this);
}

function Pregnancy() {
    this.getPregnancy = Pregnancy.prototype.getPregnancy.bind(this);
    this.createPregnancy = Pregnancy.prototype.createPregnancy.bind(this);
    this.editPregnancy = Pregnancy.prototype.editPregnancy.bind(this);
    this.deletePregnancy = Pregnancy.prototype.deletePregnancy.bind(this);
    this.getPregnancyOutcomes = Pregnancy.prototype.getPregnancyOutcomes.bind(this);
}

Demographic.prototype.getDemographic = function (whereObj) {
    return new Promise((resolve, reject) => getEntry('PATIENT_DEMOGRAPHIC', whereObj, '*').then((result) => {
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                delete result[i].createdByUser;
                delete result[i].createdTime;
                delete result[i].deleted;
            }
        }
        return resolve(result);
    }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};

Demographic.prototype.editDemographic = function (user, demogEntry) {
    return new Promise((resolve, reject) => updateEntry('PATIENT_DEMOGRAPHIC', user, '*', { id: demogEntry.id }, demogEntry).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
};

Demographic.prototype.createDemographic = function (entryObj) {
    return new Promise((resolve, reject) => createEntry('PATIENT_DEMOGRAPHIC', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

Demographic.prototype.deleteDemographic = function (user, whereObj) {
    return new Promise((resolve, reject) => deleteEntry('PATIENT_DEMOGRAPHIC', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

Demographic.prototype.getSmokingFields = function () {
    return new Promise((resolve, reject) => getEntry('SMOKING_HISTORY', {}, '*').then((result) => {
        let returnObj = { 'smoking_history': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};
Demographic.prototype.getAlcoholUsageFields = function () {
    return new Promise((resolve, reject) => getEntry('ALCOHOL_USAGE', {}, '*').then((result) => {
        let returnObj = { 'alcohol_usage': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};

Demographic.prototype.getCountryFields = function () {
    return new Promise((resolve, reject) => getEntry('COUNTRIES', {}, '*').then((result) => {
        let returnObj = { 'countries': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};

Demographic.prototype.getEthnicityFields = function () {
    return new Promise((resolve, reject) => getEntry('ETHNICITIES', {}, '*').then((result) => {
        let returnObj = { 'ethnicities': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};

Demographic.prototype.getDominantHandsFields = function () {
    return new Promise((resolve, reject) => getEntry('DOMINANT_HANDS', {}, '*').then((result) => {
        let returnObj = { 'dominant_hands': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};

Demographic.prototype.getGenderFields = function () {
    return new Promise((resolve, reject) => getEntry('GENDERS', {}, '*').then((result) => {
        let returnObj = { 'genders': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};

Immunisation.prototype.getImmunisation = function (whereObj) {
    return new Promise((resolve, reject) => getEntry('PATIENT_IMMUNISATION', whereObj, '*').then((result) => {
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                delete result[i].createdByUser;
                delete result[i].createdTime;
                delete result[i].deleted;
            }
        }
        return resolve(result);
    }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};


Immunisation.prototype.editImmunisation = function (user, demogEntry) {
    return new Promise((resolve, reject) => updateEntry('PATIENT_IMMUNISATION', user, '*', { id: demogEntry.id }, demogEntry).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
};

Immunisation.prototype.createImmunisation = function (entryObj) {
    return new Promise((resolve, reject) => createEntry('PATIENT_IMMUNISATION', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

Immunisation.prototype.deleteImmunisation = function (user, whereObj) {
    return new Promise((resolve, reject) => deleteEntry('PATIENT_IMMUNISATION', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

MedicalHistory.prototype.getMedicalHistory = function (whereObj) {
    return new Promise((resolve, reject) => getEntry('MEDICAL_HISTORY', whereObj, '*').then((result) => {
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                delete result[i].createdByUser;
                delete result[i].createdTime;
                delete result[i].deleted;
            }
        }
        return resolve(result);
    }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};


MedicalHistory.prototype.editMedicalHistory = function (user, demogEntry) {
    return new Promise((resolve, reject) => updateEntry('MEDICAL_HISTORY', user, '*', { id: demogEntry.id }, demogEntry).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
};

MedicalHistory.prototype.createMedicalHistory = function (entryObj) {
    return new Promise((resolve, reject) => createEntry('MEDICAL_HISTORY', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

MedicalHistory.prototype.deleteMedicalHistory = function (user, whereObj) {
    return new Promise((resolve, reject) => deleteEntry('MEDICAL_HISTORY', user, whereObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

MedicalHistory.prototype.getRelations = function () {
    return new Promise((resolve, reject) => getEntry('RELATIONS', {}, '*').then((result) => {
        let returnObj = { 'relations': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};

MedicalHistory.prototype.getConditions = function () {
    return new Promise((resolve, reject) => getEntry('CONDITIONS', {}, '*').then((result) => {
        let returnObj = { 'conditions': result };
        return resolve(returnObj);
    }).catch((error) => reject(error)));
};

Pregnancy.prototype.getPregnancy = function (whereObj) {
    return new Promise((resolve, reject) => getEntry('PATIENT_PREGNANCY', whereObj, { id: 'id', patient: 'patient', startDate: 'startDate', outcome: 'outcome', outcomeDate: 'outcomeDate', meddra: 'meddra' }).then((result) => resolve(result)).catch((error) => reject(error)));
};

Pregnancy.prototype.createPregnancy = function (entryObj) {
    return new Promise((resolve, reject) => createEntry('PATIENT_PREGNANCY', entryObj).then((result) => resolve(result)).catch((error) => reject(error)));
};

Pregnancy.prototype.editPregnancy = function (user, entryObj) {
    return new Promise((resolve, reject) => updateEntry('PATIENT_PREGNANCY', user, '*', { 'id': entryObj.id }, entryObj).then((result) => resolve(result)).catch((error) => reject(error)));
};

Pregnancy.prototype.deletePregnancy = function (user, whereObj) {
    return new Promise((resolve, reject) => deleteEntry('PATIENT_PREGNANCY', user, whereObj).then((result) => resolve(result)).catch((error) => reject(error)));
};

Pregnancy.prototype.getPregnancyOutcomes = function () {
    return new Promise((resolve, reject) => getEntry('PREGNANCY_OUTCOMES', {}).then((result) => resolve(result)).catch((error) => reject(error)));
};

module.exports = { DemographicCore: Demographic, MedicalHistoryCore: MedicalHistory, ImmunisationCore: Immunisation, PregnancyCore: Pregnancy };