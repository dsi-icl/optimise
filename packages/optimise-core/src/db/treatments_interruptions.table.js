export const TABLE_NAME = 'TREATMENTS_INTERRUPTIONS';
export const PRIORITY = 4;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('treatment').notNullable().references('id').inTable('TREATMENTS').onDelete('CASCADE');
                table.text('startDate').notNullable();
                table.text('endDate').nullable();
                table.integer('reason').nullable().references('id').inTable('REASONS');
                table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['treatment', 'startDate', 'deleted']);
            });
        default:
            break;
    }
};