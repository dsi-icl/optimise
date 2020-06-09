import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'CONCOMITANT_MED';
export const PRIORITY = 3;
export default async (dbcon, version) => {
    switch (version) {
        case 8:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('visit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
                table.integer('concomitantMedId').notNullable().references('id').inTable('AVAILABLE_CONCOMITANT_MED').onDelete('CASCADE');
                table.text('indication').notNullable().defaultTo('Not provided');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.text('startDate').notNullable();
                table.text('endDate').nullable();
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['visit', 'concomitantMedId', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};