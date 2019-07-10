import os from 'os';
import request from 'request';
import { getEntry } from '../utils/controller-utils';
import dbcon from '../utils/db-connection';
import PatientCore from './patient';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';

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
        let hostURL;
        try {
            hostURL = new URL(options.host);
        } catch (e) {
            return Promise.reject(ErrorHelper(message.errorMessages.UPDATEFAIL, e));
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
        return new Promise((resolve, reject) => {
            if (process.__undefined__)
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync status could not be retreived'));
            return resolve({
                status: 'success'
            });
        });
    }


    /**
     * @function triggerSync trigger synchronization.
     *
     */
    static async triggerSync() {
        const config = await SyncCore.getSyncOptions();
        return new Promise((resolve, reject) => {
            if (config === undefined)
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, 'Sync configuration not initialized or invalid'));
            setTimeout(() => {
                SyncCore.startSync(config).catch(err => console.error('plop 5', err));
            }, 1000);
            return resolve({
                status: 'success'
            });
        });
    }

    /**
     * @function startSync start synchronization.
     *
     * @param {*} config Connection information for synchronization
     */
    static async startSync(config) {
        const patients = await dbcon().select().table('PATIENTS');
        const users = await dbcon().select().table('USERS');
        if (patients.length <= 0)
            return;
        let patientPromises = [];
        let patientProfiles = [];
        patients.forEach(patient => {
            patientPromises.push(PatientCore.getPatientProfile({ 'id': patient.id }, true).then(result => {
                patientProfiles.push({
                    ...patient,
                    ...result,
                    aliasId: undefined,
                    patientId: undefined
                });
                return true;
            }).catch(err => console.error('plop 3', err)));
        });
        await Promise.all(patientPromises).catch(err => console.error('plop 4', err));
        const data = JSON.stringify({
            uuid: config.id,
            oshost: os.hostname(),
            key: config.key,
            data: {
                patients: patientProfiles,
                users: users.map(user => {
                    delete user.pw;
                    delete user.salt;
                    delete user.iterations;
                    return user;
                })
            }
        });

        const options = {
            uri: `${config.host}api/sync/v1`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        };
        try {
            request(options, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    const result = JSON.parse(body);
                    console.log('plop 1', result);
                }
            });
        } catch (e) {
            console.error('plop 2', e);
        }

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