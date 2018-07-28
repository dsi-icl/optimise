const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { createEntry, updateEntry, deleteEntry, getEntry } = require('../utils/controller-utils');

function Test() {
    this.getTest = Test.prototype.getTest.bind(this);
    this.createTest = Test.prototype.createTest.bind(this);
    this.updateTest = Test.prototype.updateTest.bind(this);
    this.deleteTest = Test.prototype.deleteTest.bind(this);
}

Test.prototype.getTest = function (whereObj) {
    return new Promise(function (resolve, reject) {
        getEntry('ORDERED_TESTS', whereObj, '*').then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

Test.prototype.createTest = function (user, test) {
    return new Promise(function (resolve, reject) {
        if (typeof test.visitId !== 'number' || typeof test.expectedDate !== 'string' || typeof test.type !== 'number') {
            reject(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        let entryObj = {
            'orderedDuringVisit': test.visitId,
            'type': test.type,
            'expectedOccurDate': Date.parse(test.expectedDate),
            'actualOccurredDate': test.actualOccurredDate ? Date.parse(test.actualOccurredDate) : undefined,
            'createdByUser': user.id
        };
        createEntry('ORDERED_TESTS', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Test.prototype.updateTest = function (user, entryTest) {
    return new Promise(function (resolve, reject) {
        updateEntry('ORDERED_TESTS', user, '*', { id: entryTest.id }, entryTest).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

Test.prototype.deleteTest = function (requester, idTest) {
    return new Promise(function (resolve, reject) {
        deleteEntry('ORDERED_TESTS', requester, idTest).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = Test;