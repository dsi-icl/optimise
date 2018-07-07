const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const knex = require('../utils/db-connection');

function VisitDataCore() {
    this.getVisitData = VisitDataCore.prototype.getVisitData.bind(this);
    this.createVisitData = VisitDataCore.prototype.createVisitData.bind(this);
    this.updateVisitData = VisitDataCore.prototype.updateVisitData.bind(this);
    this.deleteVisitData = VisitDataCore.prototype.deleteVisitData.bind(this);
}

function TestDataCore() {
    this.getTestData = TestDataCore.prototype.getTestData.bind(this);
    this.createTestData = TestDataCore.prototype.createTestData.bind(this);
    this.updateTestData = TestDataCore.prototype.updateTestData.bind(this);
    this.deleteTestData = TestDataCore.prototype.deleteTestData.bind(this);
}

function ClinicalEventsDataCore() {
    this.getClinicalEventsData = ClinicalEventsDataCore.prototype.getClinicalEventsData.bind(this);
    this.createClinicalEventsData = ClinicalEventsDataCore.prototype.createClinicalEventsData.bind(this);
    this.updateClinicalEventsData = ClinicalEventsDataCore.prototype.updateClinicalEventsData.bind(this);
    this.deleteClinicalEventsData = ClinicalEventsDataCore.prototype.deleteClinicalEventsData.bind(this);
}

function DataCore() {
    this.deleteData = DataCore.prototype.deleteData.bind(this);
}

DataCore.prototype.deleteData = function (requester, options, idData, deleteObj) {
    return new Promise(function (resolve, reject) {
        knex.transaction(trx => {
            knex(options.dataTable)
                .where('field', 'in', deleteObj)
                .andWhere('deleted', '-')
                .andWhere(options.dataTableForeignKey, idData)
                .update({ 'deleted': `${requester.userid}@${JSON.stringify(new Date())}` })
                .transacting(trx)
                .then(function (result) {
                    resolve(result);
                }, function (error) {
                    reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                })
                .then(trx.commit)
                .catch(trx.rollback);
        })
    });
};

VisitDataCore.prototype.getVisitData = function (whereObj) {
    return new Promise(function (resolve, reject) {
        return getEntry('VISIT_DATA', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

VisitDataCore.prototype.createVisitData = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('VISIT_DATA', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

VisitDataCore.prototype.updateVisitData = function (requester, whereObj, newObj) {
    return new Promise(function (resolve, reject) {
        return updateEntry('VISIT_DATA', requester, '*', whereObj, newObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

VisitDataCore.prototype.deleteVisitData = function (requester, whereObj) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('VISIT_DATA', requester, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.deleteEntry, error));
        });
    });
};

TestDataCore.prototype.getTestData = function (whereObj) {
    return new Promise(function (resolve, reject) {
        return getEntry('TEST_DATA', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

TestDataCore.prototype.createTestData = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('TEST_DATA', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

TestDataCore.prototype.updateTestData = function (requester, whereObj, newObj) {
    return new Promise(function (resolve, reject) {
        return updateEntry('TEST_DATA', requester, '*', whereObj, newObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

TestDataCore.prototype.deleteTestData = function (requester, whereObj) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('TEST_DATA', requester, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.deleteEntry, error));
        });
    });
};

ClinicalEventsDataCore.prototype.getClinicalEventsData = function (whereObj) {
    return new Promise(function (resolve, reject) {
        return getEntry('CLINICAL_EVENTS_DATA', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

ClinicalEventsDataCore.prototype.createClinicalEventsData = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('CLINICAL_EVENTS_DATA', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

ClinicalEventsDataCore.prototype.updateClinicalEventsData = function (requester, whereObj, newObj) {
    return new Promise(function (resolve, reject) {
        return updateEntry('CLINICAL_EVENTS_DATA', requester, '*', whereObj, newObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

ClinicalEventsDataCore.prototype.deleteClinicalEventsData = function (requester, whereObj) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('CLINICAL_EVENTS_DATA', requester, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.deleteEntry, error));
        });
    });
};

module.exports = DataCore;
//module.exports = { VisitDataCore: VisitDataCore, TestDataCore: TestDataCore, ClinicalEventsDataCore: ClinicalEventsDataCore };