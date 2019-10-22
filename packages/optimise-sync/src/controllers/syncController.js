import ErrorHelper from '../utils/error_helper';
import syncCore from '../core/syncCore';
import message from '../utils/message-utils';

class SyncController {

    static async createSync({ body: { data, uuid, agent, key }, headers, connection }, res) {

        if (data === undefined || uuid === undefined) {
            res.status(401).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        try {
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

    static async createSyncV1_0(req, res) {
        return SyncController.createSync(req, res);
    }

    static async createSyncV1_1({ body, headers, connection }, res) {

        try {
            return SyncController.createSync({
                body: {
                    ...body,
                    data: body.data !== undefined ? JSON.parse(decodeURI(body.data)) : undefined
                },
                headers,
                connection
            }, res);
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