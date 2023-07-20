import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'VISITS';
export const PRIORITY = 2;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
        case 2:
        case 3:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.text('visitDate').notNullable();
                table.integer('type').notNullable().references('id').inTable('AVAILABLE_VISIT_TYPES').defaultTo(1);
                table.text('communication').nullable();
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
            });
            await tableCopyBack(TABLE_NAME);
            break;
        case 16:
            await dbcon().schema.table(TABLE_NAME, (table) => {
                table.dropForeign('patient');
                table.foreign('patient').references('id').inTable('PATIENTS').onDelete('CASCADE');
            });
            break;
        case 17:
            await dbcon().schema.table(TABLE_NAME, (table) => {
                table.dropForeign('patient');
                table.foreign('patient').references('id').inTable('PATIENTS').onDelete('CASCADE');
            });
            break;
        default:
            break;
    }
};