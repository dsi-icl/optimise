export const TABLE_NAME = 'AVAILABLE_VISIT_TYPES';
export const PRIORITY = 0;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('module').nullable();
                table.text('name').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['name', 'deleted']);
            });
        default:
            break;
    }
};