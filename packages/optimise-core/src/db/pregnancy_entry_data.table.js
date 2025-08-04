import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'PREGNANCY_ENTRY_DATA';
export const PRIORITY = 4;
export default async (dbcon, version) => {
    switch (version) {
        case 18:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('pregnancyEntry').notNullable().references('id').inTable('PREGNANCY_ENTRY').onDelete('CASCADE');
                table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_PREGNANCY_ENTRY');
                table.text('value').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['pregnancyEntry', 'field', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        case 19:
            await dbcon().schema.table(TABLE_NAME, (table) => {
                table.dropForeign('pregnancyEntry');
                table.foreign('pregnancyEntry').references('id').inTable('PREGNANCY_ENTRY').onDelete('CASCADE');
            });
            break;
        default:
            break;
    }
};
