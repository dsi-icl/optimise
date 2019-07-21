import { tableMove, tableCopyBack } from '../utils/';

export const TABLE_NAME = 'TREATMENTS_INTERRUPTIONS';
export const PRIORITY = 4;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
        case 2:
        case 3:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('treatment').notNullable().references('id').inTable('TREATMENTS').onDelete('CASCADE');
                table.text('startDate').notNullable();
                table.text('endDate').nullable();
                table.integer('reason').nullable().references('id').inTable('REASONS');
                table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['treatment', 'startDate', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};