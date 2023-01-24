import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import InfoCore from '../core/info';
import formatToJSON from '../utils/format-response';

class InfoController {

    static getInfo({ user }, res) {
        if (user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        InfoCore.getInfo().then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }
}

export default InfoController;