import { tableMove, tableCopyBack } from '../utils/';

export const TABLE_NAME = 'MEDICAL_HISTORY';
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
                table.integer('relation').notNullable().references('id').inTable('RELATIONS');
                table.integer('conditionName').notNullable().references('id').inTable('CONDITIONS');
                table.text('startDate');
                table.text('outcome').notNullable();
                table.integer('resolvedYear');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'relation', 'conditionName', 'startDate', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};