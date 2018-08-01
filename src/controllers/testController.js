const TestCore = require('../core/test');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const moment = require('moment');

function TestController() {
    this.test = new TestCore();

    this.createTest = TestController.prototype.createTest.bind(this);
    this.updateTest = TestController.prototype.updateTest.bind(this);
    this.deleteTest = TestController.prototype.deleteTest.bind(this);
}

TestController.prototype.createTest = function (req, res) {
    if (!req.body.hasOwnProperty('visitId') || !req.body.hasOwnProperty('expectedDate') || !req.body.hasOwnProperty('type')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.visitId !== 'number' || typeof req.body.expectedDate !== 'string' || typeof req.body.type !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    let momentExpect = moment(req.body.expectedDate, moment.ISO_8601);
    if (!momentExpect.isValid()) {
        let msg = message.dateError[momentExpect.invalidAt()] !== undefined ? message.dateError[momentExpect.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    }
    let momentOccur = moment(req.body.actualOccurredDate, moment.ISO_8601);
    if (req.body.hasOwnProperty('actualOccurredDate') && !momentOccur.isValid()) {
        let msg = message.dateError[momentOccur.invalidAt()] !== undefined ? message.dateError[momentOccur.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    }
    let entryObj = {
        'orderedDuringVisit': req.body.visitId,
        'type': req.body.type,
        'expectedOccurDate': momentExpect.valueOf(),
        'actualOccurredDate': req.body.hasOwnProperty('actualOccurredDate') ? momentOccur.valueOf() : null,
        'createdByUser': req.user.id
    };
    this.test.createTest(entryObj).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return;
    });
};

TestController.prototype.updateTest = function (req, res) {
    if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.test.updateTest(req.user, req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
    });
};

TestController.prototype.deleteTest = function (req, res) {
    if (req.body.hasOwnProperty('testId') && typeof req.body.testId === 'number') {
        this.test.deleteTest(req.user, { 'id': req.body.testId }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    }
    else {
        if (!req.body.hasOwnProperty('testId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }
};

module.exports = TestController;