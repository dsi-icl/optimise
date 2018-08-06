const { getEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

function ActionLog() {
    this.getLogs = ActionLog.prototype.getLogs.bind(this);
}

ActionLog.prototype.getLogs = function () {
    return new Promise(function (resolve, reject) {
        return getEntry('LOG_ACTIONS', {}, '*').then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

module.exports = ActionLog;