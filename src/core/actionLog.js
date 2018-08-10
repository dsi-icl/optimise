const { getEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const knex = require('../utils/db-connection');

function ActionLog() {
    this.getLogs = ActionLog.prototype.getLogs.bind(this);
    this.erasePatients = ActionLog.prototype.erasePatients.bind(this);
    this.eraseVisits = ActionLog.prototype.eraseVisits.bind(this);
    this.eraseTests = ActionLog.prototype.eraseTests.bind(this);
    this.eraseCE = ActionLog.prototype.eraseCE.bind(this);
    this.eraseTreatments = ActionLog.prototype.eraseTreatments.bind(this);
    this.eraseTreatmentsInters = ActionLog.prototype.eraseTreatmentsInters.bind(this);
}

ActionLog.prototype.getLogs = function () {
    return new Promise((resolve, reject) =>
        getEntry('LOG_ACTIONS', {}, '*')
            .then((result) => {
                resolve(result);
                return;
            })
            .catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};

ActionLog.prototype.erasePatients = function (patientId, patientAlias) {
    return new Promise(function (resolve, reject) {
        return knex('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"aliasId":"${patientAlias}"%`)
            .orWhere('body', 'like', `%"patient":${patientId},%`)
            .orWhere('body', 'like', `%"patient":${patientId}}%`)
            .orWhere('body', 'like', `%"patientId":${patientId},%`)
            .orWhere('body', 'like', `%"patientId":${patientId}}%`)
            .orWhere('router', 'like', `%/${patientAlias}`)
            .then(function (result) {
                resolve(result);
                return;
            }, function (error) {
                reject(error);
                return;
            });
    });
};

ActionLog.prototype.eraseVisits = function (visitId) {
    return new Promise(function (resolve, reject) {
        return knex('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"visit":${visitId},%`)
            .orWhere('body', 'like', `%"visit":${visitId}}%`)
            .orWhere('body', 'like', `%"visitId":${visitId},%`)
            .orWhere('body', 'like', `%"visitId":${visitId}}%`)
            .orWhere('body', 'like', `%"orderedDuringVisit":${visitId},%`)
            .orWhere('body', 'like', `%"orderedDuringVisit":${visitId}}%`)
            .then(function (result) {
                resolve(result);
                return;
            }, function (error) {
                reject(error);
                return;
            });
    });
};

ActionLog.prototype.eraseCE = function (clinicalEventId) {
    return new Promise(function (resolve, reject) {
        return knex('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"clinicalEventId":${clinicalEventId},%`)
            .orWhere('body', 'like', `%"clinicalEventId":${clinicalEventId}}%`)
            .then(function (result) {
                resolve(result);
                return;
            }, function (error) {
                reject(error);
                return;
            });
    });
};

ActionLog.prototype.eraseTreatments = function (treatmentsId) {
    return new Promise(function (resolve, reject) {
        return knex('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"treatmentId":${treatmentsId},%`)
            .orWhere('body', 'like', `%"treatmentId":${treatmentsId}"%`)
            .then(function (result) {
                resolve(result);
                return;
            }, function (error) {
                reject(error);
                return;
            });
    });
};

ActionLog.prototype.eraseTreatmentsInters = function (treatmentsInterId) {
    return new Promise(function (resolve, reject) {
        return knex('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"treatmentInterId":${treatmentsInterId},%`)
            .orWhere('body', 'like', `%"treatmentInterId":${treatmentsInterId}}%`)
            .then(function (result) {
                resolve(result);
                return;
            }, function (error) {
                reject(error);
                return;
            });
    });
};

ActionLog.prototype.eraseTests = function (testId) {
    return new Promise(function (resolve, reject) {
        return knex('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"testId":${testId},%`)
            .orWhere('body', 'like', `%"testId":${testId}}%`)
            .then(function (result) {
                return resolve(result);
            }, function (error) {
                return reject(error);
            });
    });
};

ActionLog.prototype.eraseIdOnRoute = function (route, id) {
    return new Promise(function (resolve, reject) {
        return knex('LOG_ACTIONS')
            .del()
            .where({ 'router': route })
            .andWhere('body', 'like', `%"id":${id},%`)
            .then(function (result) {
                return resolve(result);
            }, function (error) {
                return reject(error);
            });
    });
};

module.exports = ActionLog;