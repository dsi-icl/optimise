import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'TREATMENTS';
export const PRIORITY = 3;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
        case 2:
        case 3:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('orderedDuringVisit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
                table.integer('drug').nullable().references('id').inTable('AVAILABLE_DRUGS');
                table.text('drug_notes').nullable();
                table.integer('dose').nullable();
                table.text('unit').nullable();
                table.text('form').nullable();
                table.text('times').nullable();
                table.text('intervalUnit').nullable();
                table.text('startDate').notNullable();
                table.text('terminatedDate').nullable();
                table.integer('terminatedReason').nullable().references('id').inTable('REASONS');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['orderedDuringVisit', 'drug', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};