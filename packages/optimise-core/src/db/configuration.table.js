import uuid from 'uuid/v4';

export const TABLE_NAME = 'OPT_KV';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 3:
            return dbcon()(TABLE_NAME).insert([{
                key: 'SYNC_AGENT_ID',
                value: uuid(),
                created_at: dbcon().fn.now(),
                updated_at: dbcon().fn.now()
            }, {
                key: 'SYNC_HOST',
                value: '',
                created_at: dbcon().fn.now(),
                updated_at: dbcon().fn.now()
            }, {
                key: 'SYNC_KEY',
                value: '',
                created_at: dbcon().fn.now(),
                updated_at: dbcon().fn.now()
            }, {
                key: 'SYNC_STATUS',
                value: '{}',
                created_at: dbcon().fn.now(),
                updated_at: dbcon().fn.now()
            }]);
        default:
            break;
    }
};