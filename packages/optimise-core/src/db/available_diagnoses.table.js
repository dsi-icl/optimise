import diagnoses from './defaults_v1/diagnoses.json';
import v8_diagnoses from './defaults_v8/diagnoses.json';

export const TABLE_NAME = 'AVAILABLE_DIAGNOSES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('value').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['value', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert(diagnoses);
            break;
        case 8:
            await dbcon()(TABLE_NAME).insert(v8_diagnoses);
            break;
        default:
            break;
    }
};