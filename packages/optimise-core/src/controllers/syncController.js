import ErrorHelper from '../utils/error_helper';
import syncCore from '../core/sync';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';

class SyncController {

    static getSyncOptions({ user }, res) {
        if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        syncCore.getSyncOptions().then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }

    static setSyncOptions({ body, user }, res) {
        if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        if (!body.hasOwnProperty('host') || !body.hasOwnProperty('key')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        syncCore.setSyncOptions(body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static getSyncStatus({ user }, res) {
        if (!user || user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        syncCore.getSyncStatus().then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }

    static triggerSync(__unused__req, res) {
        syncCore.triggerSync().then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }
}

export default SyncController;