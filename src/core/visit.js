const { createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');
const message = require('../utils/message-utils');
const ErrorHelper = require('../utils/error_helper');
const knex = require('../utils/db-connection');

function Visit() {
    this.getVisit = Visit.prototype.getVisit.bind(this);
    this.creteVisit = Visit.prototype.createVisit.bind(this);
    this.updateVisit = Visit.prototype.updateVisit.bind(this);
    this.deleteVisit = Visit.prototype.deleteVisit.bind(this);
}

Visit.prototype.getVisit = function (patientInfo) {
    return new Promise(function (resolve, reject) {
        knex('PATIENTS')
            .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', { visitId: 'VISITS.id' }, 'VISITS.visitDate', 'VISITS.type')
            .leftOuterJoin('VISITS', 'PATIENTS.id', 'VISITS.patient')
            .where({ 'PATIENTS.aliasId': patientInfo, 'VISITS.deleted': '-' })
            .then(function (result) {
                resolve(result);
            }, function (error) {
                reject(ErrorHelper(message.errorMessages.GETFAIL, error));
            });
    });
};

Visit.prototype.createVisit = function (user, visit) {
    return new Promise(function (resolve, reject) {
        let entryObj = {};
        if (isNaN(Date.parse(visit.visitDate))) {
            reject(ErrorHelper(message.userError.INVALIDDATE, new Error(message.userError.WRONGARGUMENTS)));
            return;
        }
        else {
            entryObj.visitDate = Date.parse(visit.visitDate);
        }
        entryObj.patient = visit.patientId;
        if (visit.hasOwnProperty('type'))
            entryObj.type = visit.type;
        entryObj.createdByUser = user.id;
        createEntry('VISITS', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Visit.prototype.updateVisit = function (user, updatedObj) {
    return new Promise(function (resolve, reject) {
        if (isNaN(Date.parse(updatedObj.visitDate))) {
            reject(ErrorHelper(message.userError.INVALIDDATE, new Error(message.userError.WRONGARGUMENTS)));
            return;
        }
        else {
            updatedObj.visitDate = Date.parse(updatedObj.visitDate);
        }
        updateEntry('VISITS', user, '*', { id: updatedObj.id }, updatedObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

Visit.prototype.deleteVisit = function (user, visitId) {
    return new Promise(function (resolve, reject) {
        deleteEntry('VISITS', user, { id: visitId }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = Visit;