import { tableMove, tableCopyBack } from '../utils/';

export const TABLE_NAME = 'ORDERED_TESTS';
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
                table.integer('type').notNullable().references('id').inTable('AVAILABLE_TEST_TYPES');
                table.text('expectedOccurDate').notNullable();
                table.text('actualOccurredDate').nullable();
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['orderedDuringVisit', 'type', 'expectedOccurDate', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};