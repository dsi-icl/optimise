export const TABLE_NAME = 'PATIENTS';
export const PRIORITY = 1;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.boolean('consent').notNullable().defaultTo(false);
                table.text('uuid').notNullable();
                table.text('aliasId').notNullable();
                table.text('study').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['aliasId', 'deleted']);
            });
        default:
            break;
    }
};