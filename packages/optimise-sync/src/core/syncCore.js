import dbcon from '../utils/db-connection';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';

class SyncCore {

    /**
     * @function updatePatient updates a patient profile
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} profile Patient Profile to save
     * @returns a Promise that contains the result from the select query
     */
    static async updatePatientProfile(agent, profile) {
        const db = await dbcon().then(client => client.db());
        return new Promise((resolve, reject) => {
            resolve(db.collection(`PATIENT_PROFILES_${agent.toUpperCase()}`).updateOne({ uuid: profile.uuid }, {
                $set: profile
            }, { upsert: true }).catch(e => reject(e)));
        });
    }

    /**
     * @function updatePatient updates a patient profile
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} profile Patient Profile to save
     * @returns a Promise that contains the result from the select query
     */
    static async updateUser(agent, user) {
        const db = await dbcon().then(client => client.db());
        return new Promise((resolve, reject) => {
            resolve(db.collection(`USERS_${agent.toUpperCase()}`).updateOne({ uuid: user.uuid }, {
                $set: user
            }, { upsert: true }).catch(e => reject(e)));
        });
    }
}

export default SyncCore;