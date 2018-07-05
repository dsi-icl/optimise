const { getEntry, createEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

const ClinicalEventModel = {
    patient: null,
    recordedDuringVisit: null,
    type: 0,
    dateStartDate: '',
    endDate: null
};

function ClinicalEvent() {
    this.getClinicalEvent = ClinicalEvent.prototype.getClinicalEvent.bind(this);
    this.createClinicalEvent = ClinicalEvent.prototype.createClinicalEvent.bind(this);
    this.deleteClinicalEvent = ClinicalEvent.prototype.deleteClinicalEvent.bind(this);
}

/**
 * @function getClinicalEvent retrieve the clinical event wished.
 *
 * @returns a Promise that contains the result from the select query
 */
ClinicalEvent.prototype.getClinicalEvent = function(requestedObj) {
    return new Promise(function (resolve, reject) {
        getEntry('CLINICAL_EVENTS', requestedObj).then(function(result) {
            resolve(result);
        }, function(error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};


/**
 * @function createClinicalEvent add a new entry of clinicalEvent
 *
 * @param {Requester} requester Information about the requester
 * @param {ClinicalEventModel} ce The added clinicalEvent
 *
 * @returns a new Promise
 */
ClinicalEvent.prototype.createClinicalEvent = function(requester, ce) {
    return new Promise(function (resolve, reject) {
        let entryObj = Object.assign({}, ClinicalEventModel, ce);
        entryObj.createdByUser = requester.userid;
        createEntry('CLINICAL_EVENTS', entryObj).then(function(result) {
            resolve(result);
        }, function(error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

/**
 * @function deleteClinicalEvent delete an entry of clinicalEvent from an ID.
 *
 * @param {*} requester Information about the requester
 * @param {*} idObj ID of the entry that is going to be deleted
 */
ClinicalEvent.prototype.deleteClinicalEvent = function(requester, idObj) {
    return new Promise(function(resolve, reject) {
        deleteEntry('CLINICAL_EVENTS', requester, idObj).then(function (success) {
            resolve(success);
        }, function(error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = ClinicalEvent;