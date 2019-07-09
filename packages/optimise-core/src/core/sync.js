import { getEntry } from '../utils/controller-utils';
import dbcon from '../utils/db-connection';
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
        const host = await dbcon()('OPT_KV').where({ key: 'SYNC_HOST' }).update({
            value: options.host,
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
}

export default SyncCore;