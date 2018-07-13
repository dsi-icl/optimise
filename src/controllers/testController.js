const TestCore = require('../core/testCore');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

function TestController() {
    this.test = new TestCore();

    this.createTest = TestController.prototype.createTest.bind(this);
    this.addActualOccurredDate = TestController.prototype.addActualOccurredDate.bind(this);
    this.deleteTest = TestController.prototype.deleteTest.bind(this);
}

TestController.prototype.createTest = function (req, res) {
    console.log(JSON.stringify(req.user));
    if (req.body.hasOwnProperty('visitId') && req.body.hasOwnProperty('expectedDate')) {
        let entryObj = {
            'orderedDuringVisit': req.body.visitId,
            'type': req.body.type,
            'expectedOccurDate': Date.parse(req.body.expectedDate),
            'createdByUser': req.user.id
        };
        this.test.createTest(entryObj).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
};

TestController.prototype.addActualOccurredDate = function (req, res) {
    if (req.body.hasOwnProperty('testId') && req.body.hasOwnProperty('actualOccurredDate')) {
        this.test.addActualOccurDateTest(req.user, { id: req.body.testId, actualOccuredDate: req.body.actualOccuredDate }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
};

TestController.prototype.deleteTest = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('testID')) {
        this.test.deleteTest(req.user, { 'id': req.body.testID }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    }
    else {
        if (req.user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
    }
};

module.exports = TestController;