import ErrorHelper from '../utils/error_helper';
import syncCore from '../core/syncCore';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';

class SyncController {

    static createSync({ body: { data, uuid } }, res) {
        if (data === undefined || uuid === undefined) {
            res.status(401).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }

        const inserts = [];
        if (data.patients !== undefined && data.patients.length > 0)
            data.patients.forEach(patient => {
                inserts.push(syncCore.updatePatientProfile(uuid, patient));
            });

        if (data.users !== undefined && data.users.length > 0)
            data.users.forEach(user => {
                inserts.push(syncCore.updateUser(uuid, user));
            });

        Promise.all(inserts).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static checkSync(__unused__req, res) {
        res.status(200).json({
            status: 'ready'
        });
    }
}

export default SyncController;