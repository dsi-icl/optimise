import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import ActionCore from '../core/actionLog';
import formatToJSON from '../utils/format-response';

class ActionController {

    static getLogs({ user }, res) {
        if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        ActionCore.getLogs().then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }
}

export default ActionController;