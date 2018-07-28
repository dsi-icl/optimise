const { getEntry, createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const knex = require('../utils/db-connection');

function Treatment() {
    this.getTreatment = Treatment.prototype.getTreatment.bind(this);
    this.createTreatment = Treatment.prototype.createTreatment.bind(this);
    this.updateTreatment = Treatment.prototype.updateTreatment.bind(this);
    this.addTerminationDateTreatment = Treatment.prototype.addTerminationDateTreatment.bind(this);
    this.deleteTreatment = Treatment.prototype.deleteTreatment.bind(this);
    this.addInterruption = Treatment.prototype.addInterruption.bind(this);
    this.deleteInterruption = Treatment.prototype.deleteInterruption.bind(this);
    this.getReasons = Treatment.prototype.getReasons.bind(this);
    this.searchReasons = Treatment.prototype.searchReasons.bind(this);
    this.getDrugs = Treatment.prototype.getDrugs.bind(this);
    this.searchDrugs = Treatment.prototype.searchDrugs.bind(this);
}

Treatment.prototype.getTreatment = function (treatment) {
    return new Promise(function (resolve, reject) {
        getEntry('TREATMENTS', treatment, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.NOTFOUND, error));
        });
    });
};

Treatment.prototype.createTreatment = function (treatment) {
    return new Promise(function (resolve, reject) {
        createEntry('TREATMENTS', treatment).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Treatment.prototype.updateTreatment = function (user, idTreatment, updatedEntry) {
    return new Promise(function (resolve, reject) {
        updateEntry('TREATMENTS', user, '*', { id: idTreatment }, updatedEntry).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

Treatment.prototype.addTerminationDateTreatment = function (idTreatment, updateEntry) {
    return new Promise(function (resolve, reject) {
        knex('TREATMENTS').where({ id: idTreatment }).update(updateEntry).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

Treatment.prototype.deleteTreatment = function (user, idTreatment) {
    return new Promise(function (resolve, reject) {
        deleteEntry('TREATMENTS', user, { id: idTreatment }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

Treatment.prototype.addInterruption = function (__unused__user, interruption) {
    return new Promise(function (resolve, reject) {
        createEntry('TREATMENTS_INTERRUPTIONS', interruption).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Treatment.prototype.deleteInterruption = function (user, idInterruption) {
    return new Promise(function (resolve, reject) {
        deleteEntry('TREATMENTS_INTERRUPTIONS', user, { id: idInterruption }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Treatment.prototype.getReasons = function () {
    return new Promise(function (resolve, reject) {
        getEntry('REASONS', {}, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

Treatment.prototype.searchReasons = function (reason) {
    return new Promise(function (resolve, reject) {
        knex('REASONS').select('*').where('value', 'like', reason).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};


Treatment.prototype.getDrugs = function () {
    return new Promise(function (resolve, reject) {
        getEntry('AVAILABLE_DRUGS', {}, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

Treatment.prototype.searchDrugs = function (drugSample) {
    return new Promise(function (resolve, reject) {
        knex('AVAILABLE_DRUGS').select('*').where('name', 'like', drugSample).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

module.exports = Treatment;