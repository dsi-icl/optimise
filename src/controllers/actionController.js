const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const ActionCore = require('../core/actionLog');
const formatToJSON = require('../utils/format-response');

function ActionCtrl() {
    this.action = new ActionCore();

    this.getLogs = ActionCtrl.prototype.getLogs.bind(this);
}

ActionCtrl.prototype.getLogs = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    this.action.getLogs().then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

module.exports = ActionCtrl;