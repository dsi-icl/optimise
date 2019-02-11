export const TABLE_NAME = 'VISITS';
export const PRIORITY = 2;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.text('visitDate').notNullable();
                table.integer('type').notNullable().references('id').inTable('AVAILABLE_VISIT_TYPES').defaultTo(1);
                table.text('communication').nullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
            });
        default:
            break;
    }
};