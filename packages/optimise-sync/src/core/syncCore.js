import dbcon from '../utils/db-connection';
class SyncCore {

    /**
     * @function updatePatient updates a patient profile
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} profile Patient Profile to save
     * @returns a Promise that contains the result from the select query
     */
    static async updatePatientProfiles(agent, profiles) {
        const db = await dbcon().then(client => client.db());
        const inserts = [];
        profiles.forEach(profile => {
            inserts.push(db.collection(`PATIENT_PROFILES_${agent.toUpperCase()}`).updateOne({ uuid: profile.uuid }, {
                $set: profile
            }, { upsert: true }).then(({ result }) => result));
        });
        return Promise.all(inserts);
    }

    /**
     * @function updatePatient updates a patient profile
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} profile Patient Profile to save
     * @returns a Promise that contains the result from the select query
     */
    static async updateUsers(agent, users) {
        const db = await dbcon().then(client => client.db());
        const inserts = [];
        users.forEach(user => {
            inserts.push(db.collection(`USERS_${agent.toUpperCase()}`).updateOne({ uuid: user.uuid }, {
                $set: user
            }, { upsert: true }).then(({ result }) => result));
        });
        return Promise.all(inserts);
    }
}

export default SyncCore;