const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const ActionCore = require('../core/actionLog');
const formatToJSON = require('../utils/format-response');

function ActionController() {
    this.action = new ActionCore();

    this.getLogs = ActionController.prototype.getLogs.bind(this);
}

ActionController.prototype.getLogs = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    this.action.getLogs().then(function (result) {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch(function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return false;
    });
};

module.exports = ActionController;