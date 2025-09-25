import os from 'os';
import axios from 'axios';
import { gzipSync } from 'node:zlib';
import fs from 'node:fs';
import { getEntry } from '../utils/controller-utils';
import dbcon from '../utils/db-connection';
import PatientCore from './patient';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import packageInfo from '../../package.json';

let isSyncing = false;

class SyncCore {
    /**
     * @function getSyncOptions retrieve the synchronization options.
     *
     * @returns a Promise that contains the result from the select query
     */
    static async getSyncOptions() {
        const id = await getEntry('OPT_KV', { key: 'SYNC_AGENT_ID' }, '*');
        const host = await getEntry('OPT_KV', { key: 'SYNC_HOST' }, '*');
        const key = await getEntry('OPT_KV', { key: 'SYNC_KEY' }, '*');
        return new Promise((resolve, reject) => {
            if (id.length !== 1)
                return reject(ErrorHelper(message.errorMessages.GETFAIL, 'Sync configuration not initialized'));
            resolve({
                id: id.length === 1 ? id[0].value : undefined,
                host: host.length === 1 ? host[0].value : undefined,
                key: key.length === 1 ? key[0].value : undefined
            });
        });
    }

    /**
     * @function setSyncOptions updates the synchronization options.
     *
     * @param {*} options New value to use for synchronisation
     */
    static async setSyncOptions(options) {
        let hostURL = { href: '' };
        try {
            if (options.host !== undefined && options.host.trim() !== '')
                hostURL = new URL(options.host);
        }
        catch (e) {
            return Promise.reject(ErrorHelper(message.userError.WRONGARGUMENTS, e));
        }
        const host = await dbcon()('OPT_KV').where({ key: 'SYNC_HOST' }).update({
            value: hostURL.href,
            updated_at: dbcon().fn.now()
        });
        const key = await dbcon()('OPT_KV').where({ key: 'SYNC_KEY' }).update({
            value: options.key,
            updated_at: dbcon().fn.now()
        });
        return new Promise((resolve, reject) => {
            if (host !== 1 || key !== 1)
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync configuration not initialized or invalid'));
            return resolve({
                status: 'success'
            });
        });
    }

    /**
     * @function getSyncStatus obtain synchronization status.
     *
     */
    static async getSyncStatus() {
        return new Promise((resolve, reject) => dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).then((result) => {
            if (result.length !== 1)
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync status could not be retreived'));
            return resolve(JSON.parse(result[0].value));
        }).catch(() => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync status could not be retreived'))));
    }

    /**
     * @function triggerSync trigger synchronization.
     *
     */
    static async triggerSync(options) {
        if (isSyncing)
            return this.getSyncStatus();
        const config = await SyncCore.getSyncOptions();
        config.adminPass = options ? options.adminPass : false;
        return new Promise((resolve, reject) => {
            if (config === undefined)
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync configuration not initialized or invalid'));
            const status = {
                status: 'scheduling',
                step: 'tiggered',
                syncing: true
            };
            dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify(status),
                updated_at: dbcon().fn.now()
            }).then(() => {
                setTimeout(() => {
                    SyncCore.startSync(config).catch(() => false);
                }, 1000);
                return resolve(status);
            }).catch(e => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, e)));
        });
    }

    /**
     * @function startSync start synchronization.
     *
     * @param {*} config Connection information for synchronization
     */
    static async startSync(config) {
        if (isSyncing && !config.adminPass)
            return Promise.resolve();

        isSyncing = true;

        if (config.host.trim() === '' || config.key.trim() === '') {
            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'idle'
                }),
                updated_at: dbcon().fn.now()
            });
            return;
        }

        try {
            /** @type { import('axios').AxiosRequestConfig } */
            const checkOptions = {
                url: `${config.host}api/sync/v1.1`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            };

            await (() => new Promise((resolve, reject) => {
                axios.request(checkOptions)
                    .then(async (response) => {
                        try {
                            const result = response.data !== undefined ? (typeof response.data === 'string' ? JSON.parse(response.data) : response.data) : {};
                            if (response.status !== 200) {
                                await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                    value: JSON.stringify({
                                        error: {
                                            message: result && result.error ? result.error : 'Unknown error',
                                            stack: result && result.stack ? result.stack : undefined
                                        }
                                    }),
                                    updated_at: dbcon().fn.now()
                                });
                                reject(result.error);
                            }
                            else {
                                if (result.status === 'ready')
                                    resolve();
                                else {
                                    await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                        value: JSON.stringify({
                                            error: {
                                                message: 'Synching endpoint is not ready',
                                                stack: undefined
                                            }
                                        }),
                                        updated_at: dbcon().fn.now()
                                    });
                                    reject();
                                }
                            }
                        }
                        catch (exception) {
                            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                value: JSON.stringify({
                                    error: {
                                        message: exception.message ? exception.message : 'Unknown error',
                                        stack: exception.stack ? exception.stack : undefined
                                    }
                                }),
                                updated_at: dbcon().fn.now()
                            });
                            reject();
                        }
                    })
                    .catch(async (error) => {
                        await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                            value: JSON.stringify({
                                error: {
                                    message: error.message ? error.message : 'Unknown error',
                                    stack: error.stack ? error.stack : undefined
                                }
                            }),
                            updated_at: dbcon().fn.now()
                        });
                        reject(error);
                    });
            }))();

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'collecting',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            const patients = await dbcon().select().table('PATIENTS');
            const users = await dbcon().select().table('USERS');

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'counting',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            const patientProfiles = [];
            try {
                for (const patient of patients) {
                    if (!config.adminPass)
                        await new Promise(r => setTimeout(r, 1000));
                    const result = await PatientCore.getPatientProfile({ id: patient.id }, true);
                    patientProfiles.push({
                        ...patient,
                        ...result,
                        aliasId: undefined,
                        patientId: undefined
                    });
                }
            }
            catch (err) {
                await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                    value: JSON.stringify({
                        error: {
                            message: 'Error while processing existing records',
                            exception: err
                        }
                    }),
                    updated_at: dbcon().fn.now()
                });
            }

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'merging',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            const metadata = {
                uuid: config.id,
                agent: {
                    hostname: os.hostname(),
                    version: packageInfo.version
                },
                key: config.key
            };

            const data = JSON.stringify({
                ...metadata,
                format: 'json',
                data: encodeURI(JSON.stringify({
                    patients: patientProfiles,
                    users: users.map((user) => {
                        delete user.pw;
                        delete user.salt;
                        delete user.iterations;
                        return user;
                    })
                }))
            });

            /** @type { import('axios').AxiosRequestConfig } */
            const syncOptions = {
                url: `${config.host}api/sync/v1.1`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': data.length
                },
                data
            };

            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'running',
                    step: 'linking',
                    syncing: true
                }),
                updated_at: dbcon().fn.now()
            });

            try {
                await (() => new Promise((resolve, reject) => {
                    axios.request(syncOptions)
                        .then(async (response) => {
                            try {
                                const result = response.data !== undefined ? (typeof response.data === 'string' ? JSON.parse(response.data) : response.data) : {};
                                if (response.status === 200) {
                                    if (result.status === 'success') {
                                        await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                            value: JSON.stringify({
                                                status: 'running',
                                                step: 'raw_compress',
                                                syncing: true
                                            }),
                                            updated_at: dbcon().fn.now()
                                        });
                                        resolve();
                                    }
                                    else {
                                        await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                            value: JSON.stringify({
                                                status: 'errored',
                                                step: 'errored',
                                                syncing: false,
                                                error: {
                                                    message: 'Remote did not acknowledge success'
                                                }
                                            }),
                                            updated_at: dbcon().fn.now()
                                        });
                                        reject();
                                    }
                                }
                                else {
                                    await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                        value: JSON.stringify({
                                            status: 'errored',
                                            step: 'errored',
                                            syncing: false,
                                            error: {
                                                message: result && result.error ? result.error : 'Unknown error',
                                                stack: result && result.stack ? result.stack : undefined
                                            }
                                        }),
                                        updated_at: dbcon().fn.now()
                                    });
                                    reject(result.error);
                                }
                            }
                            catch (exception) {
                                await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                    value: JSON.stringify({
                                        status: 'errored',
                                        step: 'errored',
                                        syncing: false,
                                        error: {
                                            message: exception.message ? exception.message : 'Unknown error',
                                            stack: exception.stack ? exception.stack : undefined
                                        }
                                    }),
                                    updated_at: dbcon().fn.now()
                                });
                                reject(exception);
                            }
                        })
                        .catch(async (error) => {
                            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                value: JSON.stringify({
                                    status: 'errored',
                                    step: 'errored',
                                    syncing: false,
                                    error: {
                                        message: error.message ? error.message : 'Unknown error',
                                        stack: error.stack ? error.stack : undefined
                                    }
                                }),
                                updated_at: dbcon().fn.now()
                            });
                            reject(error);
                        });
                }))();
            }
            catch (__unusedErr) {
                // Should already be handled
            }

            try {
                const sqliteBuffer = fs.readFileSync(global.config.optimiseDBLocation, { flag: 'r' });
                let compressedBuffer;
                try {
                    compressedBuffer = gzipSync(sqliteBuffer, {
                        level: 9
                    }).toString('base64');
                    await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                        value: JSON.stringify({
                            status: 'running',
                            step: 'raw_dump',
                            syncing: true
                        }),
                        updated_at: dbcon().fn.now()
                    });
                }
                catch (err) {
                    await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                        value: JSON.stringify({
                            status: 'errored',
                            step: 'errored',
                            syncing: false,
                            error: {
                                message: err.message ? err.message : 'Unknown error',
                                stack: err.stack ? err.stack : undefined
                            }
                        }),
                        updated_at: dbcon().fn.now()
                    });
                    return;
                }

                const sqliteData = JSON.stringify({
                    ...metadata,
                    format: 'sqlite',
                    data: encodeURI(JSON.stringify({
                        b64: compressedBuffer
                    }))
                });

                syncOptions.headers['Content-Length'] = sqliteData.length;
                syncOptions.data = sqliteData;
                syncOptions.timeout = 1000 * 60 * 5;

                await (() => new Promise((resolve, reject) => {
                    axios.request(syncOptions)
                        .then(async (response) => {
                            try {
                                const result = response.data !== undefined ? (typeof response.data === 'string' ? JSON.parse(response.data) : response.data) : {};
                                if (response.status === 200) {
                                    if (result.status === 'success') {
                                        await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                            value: JSON.stringify({
                                                status: 'success',
                                                step: 'done',
                                                syncing: false,
                                                lastSuccess: (new Date()).getTime()
                                            }),
                                            updated_at: dbcon().fn.now()
                                        });
                                        resolve();
                                    }
                                    else {
                                        await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                            value: JSON.stringify({
                                                status: 'errored',
                                                step: 'errored',
                                                syncing: false,
                                                error: {
                                                    message: 'Remote did not acknowledge success'
                                                }
                                            }),
                                            updated_at: dbcon().fn.now()
                                        });
                                        reject();
                                    }
                                }
                                else {
                                    await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                        value: JSON.stringify({
                                            status: 'errored',
                                            step: 'errored',
                                            syncing: false,
                                            error: {
                                                message: result && result.error ? result.error : 'Unknown error',
                                                stack: result && result.stack ? result.stack : undefined
                                            }
                                        }),
                                        updated_at: dbcon().fn.now()
                                    });
                                    reject(result.error);
                                }
                            }
                            catch (exception) {
                                await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                    value: JSON.stringify({
                                        status: 'errored',
                                        step: 'errored',
                                        syncing: false,
                                        error: {
                                            message: exception.message ? exception.message : 'Unknown error',
                                            stack: exception.stack ? exception.stack : undefined
                                        }
                                    }),
                                    updated_at: dbcon().fn.now()
                                });
                                reject(exception);
                            }
                        })
                        .catch(async (error) => {
                            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                                value: JSON.stringify({
                                    status: 'errored',
                                    step: 'errored',
                                    syncing: false,
                                    error: {
                                        message: error.message ? error.message : 'Unknown error',
                                        stack: error.stack ? error.stack : undefined
                                    }
                                }),
                                updated_at: dbcon().fn.now()
                            });
                            reject(error);
                        });
                }))();
            }
            catch (__unusedErr) {
                // Should already be handled
            }
        }
        catch (err) {
            await dbcon()('OPT_KV').where({ key: 'SYNC_STATUS' }).update({
                value: JSON.stringify({
                    status: 'errored',
                    step: 'errored',
                    syncing: false,
                    error: {
                        message: 'Failed to send data to remote',
                        exception: err
                    }
                }),
                updated_at: dbcon().fn.now()
            });
        }
        isSyncing = false;
        return Promise.resolve();

        // const tables = [
        //     'ADVERSE_EVENT_MEDDRA',
        //     'CLINICAL_EVENTS',
        //     'CLINICAL_EVENTS_DATA',
        //     'LOG_ACTIONS',
        //     'MEDICAL_HISTORY',
        //     'ORDERED_TESTS',
        //     'PATIENTS',
        //     'PATIENT_DEMOGRAPHICS',
        //     'PATIENT_DIAGNOSIS',
        //     'PATIENT_IMMUNISATION',
        //     'PATIENT_PII',
        //     'PATIENT_PREGNANCY',
        //     'TEST_DATA',
        //     'TREATMENTS',
        //     'TREATMENTS_INTERRUPTIONS',
        //     'USERS',
        //     'VISITS',
        //     'VISIT_DATA',
        //     'VISIT_REPORT'
        // ];
    }
}

export default SyncCore;
