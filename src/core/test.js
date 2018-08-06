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
    return new Promise((resolve, reject) => getEntry('ORDERED_TESTS', whereObj, '*').then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};

Test.prototype.createTest = function (entryObj) {
    return new Promise((resolve, reject) => createEntry('ORDERED_TESTS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

Test.prototype.updateTest = function (user, entryTest) {
    return new Promise((resolve, reject) => updateEntry('ORDERED_TESTS', user, '*', { id: entryTest.id }, entryTest).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
};

Test.prototype.deleteTest = function (requester, idTest) {
    return new Promise((resolve, reject) => deleteEntry('ORDERED_TESTS', requester, idTest).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
};

module.exports = Test;