const TABLE_NAME = 'AVAILABLE_TEST_TYPES';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('module').nullable();
                table.text('name').notNullable().unique();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['name', 'deleted']);
            });
        default:
            break;
    }
};