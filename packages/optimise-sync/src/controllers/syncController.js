import { gunzipSync } from 'node:zlib';
import prettyBytes from 'pretty-bytes';
import fs from 'node:fs';
import path from 'node:path';

import ErrorHelper from '../utils/error_helper';
import syncCore from '../core/syncCore';
import message from '../utils/message-utils';

class SyncController {

    static async createSync({ body: { data, uuid, agent, key, format }, headers, connection }, res) {

        if (data === undefined || uuid === undefined) {
            res.status(401).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }

        const uploadType = format === 'sqlite' ? 'sqlite' : 'json';
        const size = prettyBytes(Number.parseInt(headers['content-length'] ?? '0'));
        console.log(`Synchronisation ${uuid.replace(/\n|\r/g, '').split('-')[0]} ${uploadType} ${size}`);
        const eventRecordInfo = await syncCore.createSyncRecord(uuid, {
            ...agent,
            ip: headers !== undefined && headers['x-forwarded-for'] ? headers['x-forwarded-for'] : connection !== undefined ? connection.remoteAddress : undefined,
            type: uploadType,
            size
        }).catch(() => {
            // ignore
        });

        try {
            const validation = await syncCore.validateKey(uuid, key);
            if (validation.error !== undefined) {
                await syncCore.updateSyncRecord(eventRecordInfo.insertedId, { error: validation.error });
                res.status(400).json(ErrorHelper('Validation key error: ' + validation.error));
                return false;
            }

            if (uploadType === 'sqlite') {

                const filename = `${uuid.replace(/\n|\r/g, '')}.db`;
                const decompressedBuffer = gunzipSync(Buffer.from(data.b64, 'base64'));

                const dirPath = path.resolve(global.config.sqliteDumpsDir);
                const filePath = path.resolve(dirPath, filename);
                if (!filePath.startsWith(dirPath))
                    return res.status(500).json(ErrorHelper('Could not locate the upload directory'));

                fs.mkdirSync(dirPath, { recursive: true });
                const output = fs.createWriteStream(filePath, { flags: 'w', autoClose: true });

                output.write(decompressedBuffer);

                res.status(200).json({
                    status: 'success'
                });

            } else {
                const inserts = [];

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
                    const e = ErrorHelper(message.errorMessages.UPDATEFAIL, error);
                    syncCore.updateSyncRecord(eventRecordInfo.insertedId, { error: e.toString() })
                        .then(() => {
                            res.status(400).json(e);
                        });
                    return false;
                });
            }
        } catch (error) {
            const e = ErrorHelper(message.errorMessages.UPDATEFAIL, error);
            syncCore.updateSyncRecord(eventRecordInfo.insertedId, { error: e.toString() })
                .then(() => {
                    res.status(400).json(e);
                });
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