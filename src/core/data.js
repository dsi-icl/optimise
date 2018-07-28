const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const knex = require('../utils/db-connection');

function VisitData() {
    this.getVisitData = VisitData.prototype.getVisitData.bind(this);
    this.createVisitData = VisitData.prototype.createVisitData.bind(this);
    this.updateVisitData = VisitData.prototype.updateVisitData.bind(this);
    this.deleteVisitData = VisitData.prototype.deleteVisitData.bind(this);
}

function TestData() {
    this.getTestData = TestData.prototype.getTestData.bind(this);
    this.createTestData = TestData.prototype.createTestData.bind(this);
    this.updateTestData = TestData.prototype.updateTestData.bind(this);
    this.deleteTestData = TestData.prototype.deleteTestData.bind(this);
}

function ClinicalEventsData() {
    this.getClinicalEventsData = ClinicalEventsData.prototype.getClinicalEventsData.bind(this);
    this.createClinicalEventsData = ClinicalEventsData.prototype.createClinicalEventsData.bind(this);
    this.updateClinicalEventsData = ClinicalEventsData.prototype.updateClinicalEventsData.bind(this);
    this.deleteClinicalEventsData = ClinicalEventsData.prototype.deleteClinicalEventsData.bind(this);
}

function Data() {
    this.deleteData = Data.prototype.deleteData.bind(this);
}

Data.prototype.deleteData = function (user, options, idData, deleteObj) {
    return new Promise(function (resolve, reject) {
        knex.transaction(trx => {
            knex(options.dataTable)
                .where('field', 'in', deleteObj)
                .andWhere('deleted', '-')
                .andWhere(options.dataTableForeignKey, idData)
                .update({ 'deleted': `${user.id}@${JSON.stringify(new Date())}` })
                .transacting(trx)
                .then(function (result) {
                    resolve(result);
                }, function (error) {
                    reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    });
};

VisitData.prototype.getVisitData = function (whereObj) {
    return new Promise(function (resolve, reject) {
        return getEntry('VISIT_DATA', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

VisitData.prototype.createVisitData = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('VISIT_DATA', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

VisitData.prototype.updateVisitData = function (user, whereObj, newObj) {
    return new Promise(function (resolve, reject) {
        return updateEntry('VISIT_DATA', user, '*', whereObj, newObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

VisitData.prototype.deleteVisitData = function (user, whereObj) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('VISIT_DATA', user, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.deleteEntry, error));
        });
    });
};

TestData.prototype.getTestData = function (whereObj) {
    return new Promise(function (resolve, reject) {
        return getEntry('TEST_DATA', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

TestData.prototype.createTestData = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('TEST_DATA', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

TestData.prototype.updateTestData = function (user, whereObj, newObj) {
    return new Promise(function (resolve, reject) {
        return updateEntry('TEST_DATA', user, '*', whereObj, newObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

TestData.prototype.deleteTestData = function (user, whereObj) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('TEST_DATA', user, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.deleteEntry, error));
        });
    });
};

ClinicalEventsData.prototype.getClinicalEventsData = function (whereObj) {
    return new Promise(function (resolve, reject) {
        return getEntry('CLINICAL_EVENTS_DATA', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

ClinicalEventsData.prototype.createClinicalEventsData = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('CLINICAL_EVENTS_DATA', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

ClinicalEventsData.prototype.updateClinicalEventsData = function (user, whereObj, newObj) {
    return new Promise(function (resolve, reject) {
        return updateEntry('CLINICAL_EVENTS_DATA', user, '*', whereObj, newObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

ClinicalEventsData.prototype.deleteClinicalEventsData = function (user, whereObj) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('CLINICAL_EVENTS_DATA', user, whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.deleteEntry, error));
        });
    });
};

module.exports = Data;
//module.exports = { VisitData: VisitData, TestData: TestData, ClinicalEventsData: ClinicalEventsData };