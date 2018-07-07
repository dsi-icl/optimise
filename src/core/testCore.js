const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { createEntry, updateEntry, deleteEntry, getEntry } = require('../utils/controller-utils');

function Test() {
    this.getTest = Test.prototype.getTest.bind(this);
    this.createTest = Test.prototype.createTest.bind(this);
    this.addActualOccurDateTest = Test.prototype.addActualOccurDateTest.bind(this);
    this.deleteTest = Test.prototype.deleteTest.bind(this);
}

Test.prototype.getTest = function(whereObj){
    return new Promise(function(resolve, reject){
        getEntry('ORDERED_TESTS', whereObj, '*').then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

Test.prototype.createTest = function(entryTest){
    return new Promise(function(resolve, reject){
        createEntry('ORDERED_TESTS', entryTest).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

Test.prototype.addActualOccurDateTest = function(requester, entryTest){
    return new Promise(function(resolve, reject){
        updateEntry('ORDERED_TESTS', requester, '*', { id: entryTest.id }, entryTest).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

Test.prototype.deleteTest = function(requester, idTest){
    return new Promise(function(resolve, reject){
        deleteEntry('ORDERED_TESTS', requester, { id: idTest }).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};
module.exports = Test;