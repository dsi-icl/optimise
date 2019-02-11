export const TABLE_NAME = 'TEST_DATA';
export const PRIORITY = 4;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('test').notNullable().references('id').inTable('ORDERED_TESTS').onDelete('CASCADE');
                table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_TESTS');
                table.text('value').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['test', 'field', 'deleted']);
            });
        default:
            break;
    }
};