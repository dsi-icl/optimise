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
        return getEntry('ORDERED_TESTS', whereObj, '*').then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

Test.prototype.createTest = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('ORDERED_TESTS', entryObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Test.prototype.updateTest = function (user, entryTest) {
    return new Promise(function (resolve, reject) {
        return updateEntry('ORDERED_TESTS', user, '*', { id: entryTest.id }, entryTest).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

Test.prototype.deleteTest = function (requester, idTest) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('ORDERED_TESTS', requester, idTest).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = Test;