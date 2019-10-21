import ErrorHelper from '../utils/error_helper';
import syncCore from '../core/syncCore';
import message from '../utils/message-utils';

class SyncController {

    static async createSync({ body: { data: encodedData, uuid, agent, key }, headers, connection }, res) {

        if (encodedData === undefined || uuid === undefined) {
            res.status(401).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        try {
            const data = JSON.parse(decodeURI(encodedData));
            const validation = await syncCore.validateKey(uuid, key);
            const inserts = [];
            inserts.push(syncCore.createSyncRecord(uuid, {
                ...agent,
                error: validation.error,
                ip: headers !== undefined && headers['x-forwarded-for'] ? headers['x-forwarded-for'] : connection !== undefined ? connection.remoteAddress : undefined
            }));

            if (validation.error !== undefined) {
                res.status(400).json(ErrorHelper('Validation key error'));
                return false;
            } else {
                if (data.patients !== undefined && data.patients.length > 0)
                    inserts.push(syncCore.updatePatientProfiles(uuid, data.patients));
                if (data.users !== undefined && data.users.length > 0)
                    inserts.push(syncCore.updateUsers(uuid, data.users));

                Promise.all(inserts).then(() => {
                    res.status(200).json({
                        status: 'success'
                    });
                    return true;
                }).catch((error) => {
                    res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                    return false;
                });
            }
        } catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        }
    }

    static checkSync(__unused__req, res) {
        res.status(200).json({
            status: 'ready'
        });
    }
}

export default SyncController;