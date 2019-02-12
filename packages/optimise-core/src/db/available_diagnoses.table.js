import diagnoses from './defaults/diagnoses.json';

export const TABLE_NAME = 'AVAILABLE_DIAGNOSES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('value').notNullable();
            });
            return dbcon(TABLE_NAME).insert(diagnoses);
        default:
            break;
    }
};