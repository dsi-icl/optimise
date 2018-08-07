const { getEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

function ActionLog() {
    this.getLogs = ActionLog.prototype.getLogs.bind(this);
}

ActionLog.prototype.getLogs = function ()  {
    return new Promise((resolve, reject) => getEntry('LOG_ACTIONS', {}, '*').then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};

module.exports = ActionLog;