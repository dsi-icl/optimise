import dbcon from '../utils/db-connection';
class SyncCore {

    /**
     * @function updatePatient updates patient profiles
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} profiles Patient Profile to save
     * @returns a Promise that contains the result from the select query
     */
    static async updatePatientProfiles(agent, profiles) {
        const db = await dbcon().then(client => client.db());
        const inserts = [];
        profiles.forEach(profile => {
            inserts.push(db.collection(`PATIENT_PROFILES_${agent.toUpperCase()}`).updateOne({ id: profile.id }, {
                $set: profile
            }, { upsert: true }).then(({ result }) => result));
        });
        return Promise.all(inserts);
    }

    /**
     * @function updateUsers updates users
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} users Users to save
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

    /**
     * @function createSyncRecord record the occurrence of a synchronisation
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} info Extra information about the sync event
     * @returns a Promise that contains the result from the select query
     */
    static async createSyncRecord(agent, info) {
        const db = await dbcon().then(client => client.db());
        return db.collection('EVENTS').insertOne({
            uuid: agent,
            version: info.version,
            hostname: info.hostname,
            ip: info.ip,
            time: (new Date()).toISOString(),
            error: info.error
        });
    }

    /**
     * @function validateKey verifies a key is valid
     *
     * @param {*} agent Identifier for the agent sending the data
     * @param {*} key Validation key offered by the remote client
     * @returns a Promise that contains the result from the select query
     */
    static async validateKey(agent, key) {
        const db = await dbcon().then(client => client.db());
        const record = await db.collection('VALIDATION_KEYS').findOne({ key });
        let error = undefined;
        if (record === null || record === undefined)
            error = 'The validation key does not exist';
        else {
            if (record.claim === undefined) {
                await db.collection('VALIDATION_KEYS').updateOne({ _id: record._id }, {
                    $set: {
                        claim: agent
                    }
                }, { upsert: false });
            } else if (record.claim !== agent) {
                error = 'The validation key is claimed by a different agent';
            }
        }
        return Promise.resolve({
            success: error === undefined ? true : false,
            error
        });
    }
}

export default SyncCore;