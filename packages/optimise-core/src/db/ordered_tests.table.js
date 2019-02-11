export const TABLE_NAME = 'ORDERED_TESTS';
export const PRIORITY = 3;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('orderedDuringVisit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
                table.integer('type').notNullable().references('id').inTable('AVAILABLE_TEST_TYPES');
                table.text('expectedOccurDate').notNullable();
                table.text('actualOccurredDate').nullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['orderedDuringVisit', 'type', 'expectedOccurDate', 'deleted']);
            });
        default:
            break;
    }
};