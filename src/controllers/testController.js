const TestCore = require('../core/test');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');

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
    this.test.createTest(req.user, req.body).then(function (result) {
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
    if (req.user.priv === 1 && req.body.hasOwnProperty('testID') && typeof req.body.testID === 'number') {
        this.test.deleteTest(req.user, { 'id': req.body.testID }).then(function (result) {
            res.status(200).json(formatToJSON(result));
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
        } else if (!req.body.hasOwnProperty('testID')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }
};

module.exports = TestController;