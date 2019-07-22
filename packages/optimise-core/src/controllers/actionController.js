import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import ActionCore from '../core/actionLog';
import formatToJSON from '../utils/format-response';

class ActionController {

    static getLogs({ user, query }, res) {
        if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        let limitOffset = {};
        if (query.hasOwnProperty('limit') && typeof parseInt(query.limit) === 'number')
            limitOffset.limit = parseInt(query.limit);
        if (query.hasOwnProperty('offset') && typeof parseInt(query.offset) === 'number')
            limitOffset.offset = parseInt(query.offset);
        ActionCore.getLogs(limitOffset).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }
}

export default ActionController;