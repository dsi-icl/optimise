import { tableMove } from '../utils/db-mover';

export const TABLE_NAME = 'PATIENT_PREGNANCY_IMAGING';
export const PRIORITY = 5;
export default async (dbcon, version) => {
    switch (version) {
        case 18:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('visitId').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
                table.text('date').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.text('mode').notNullable();
                table.text('result').notNullable();
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
            });
            break;
        default:
            break;
    }
};
