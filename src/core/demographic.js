const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { getEntry, createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');

function Demographic() {
    this.getDemographic = Demographic.prototype.getDemographic.bind(this);
    this.editDemographic = Demographic.prototype.editDemographic.bind(this);
    this.createDemographic = Demographic.prototype.createDemographic.bind(this);
    this.deleteDemographic = Demographic.prototype.deleteDemographic.bind(this);
}

function MedicalHistory() {
    this.getMedicalHistory = MedicalHistory.prototype.getMedicalHistory.bind(this);
    this.editMedicalHistory = MedicalHistory.prototype.editMedicalHistory.bind(this);
    this.createMedicalHistory = MedicalHistory.prototype.createMedicalHistory.bind(this);
    this.deleteMedicalHistory = MedicalHistory.prototype.deleteMedicalHistory.bind(this);
}

function Immunisation(){
    this.getImmunisation = Immunisation.prototype.getImmunisation.bind(this);
    this.editImmunisation = Immunisation.prototype.editImmunisation.bind(this);
    this.createImmunisation = Immunisation.prototype.createImmunisation.bind(this);
    this.deleteImmunisation = Immunisation.prototype.deleteImmunisation.bind(this);
}

Demographic.prototype.getDemographic = function(whereObj) {
    return new Promise(function(resolve, reject){
        getEntry('PATIENT_DEMOGRAPHIC', whereObj, '*').then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};


Demographic.prototype.editDemographic = function(requester, demogEntry) {
    return new Promise(function(resolve, reject){
        updateEntry('PATIENT_DEMOGRAPHIC', requester, '*', { id: demogEntry.id }, demogEntry).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

Demographic.prototype.createDemographic = function(entryObj) {
    return new Promise(function(resolve, reject){
        createEntry('PATIENT_DEMOGRAPHIC', entryObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Demographic.prototype.deleteDemographic = function(requester, whereObj) {
    return new Promise(function(resolve, reject){
        deleteEntry('PATIENT_DEMOGRAPHIC', requester, whereObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Immunisation.prototype.getImmunisation = function(whereObj) {
    return new Promise(function(resolve, reject){
        getEntry('IMMUNISATION', whereObj, '*').then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};


Immunisation.prototype.editImmunisation = function(requester, demogEntry) {
    return new Promise(function(resolve, reject){
        updateEntry('IMMUNISATION', requester, '*', { id: demogEntry.id }, demogEntry).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

Immunisation.prototype.createImmunisation = function(entryObj) {
    return new Promise(function(resolve, reject){
        createEntry('IMMUNISATION', entryObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Immunisation.prototype.deleteImmunisation = function(requester, whereObj) {
    return new Promise(function(resolve, reject){
        deleteEntry('IMMUNISATION', requester, whereObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

MedicalHistory.prototype.getMedicalHistory = function(whereObj) {
    return new Promise(function(resolve, reject){
        getEntry('MEDICAL_HISTORY', whereObj, '*').then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};


MedicalHistory.prototype.editMedicalHistory = function(requester, demogEntry) {
    return new Promise(function(resolve, reject){
        updateEntry('MEDICAL_HISTORY', requester, '*', { id: demogEntry.id }, demogEntry).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

MedicalHistory.prototype.createMedicalHistory = function(entryObj) {
    return new Promise(function(resolve, reject){
        createEntry('MEDICAL_HISTORY', entryObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

MedicalHistory.prototype.deleteMedicalHistory = function(requester, whereObj) {
    return new Promise(function(resolve, reject){
        deleteEntry('MEDICAL_HISTORY', requester, whereObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

module.exports = { DemographicCore: Demographic, MedicalHistoryCore: MedicalHistory, ImmunisationCore: Immunisation };