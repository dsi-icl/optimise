const TABLE_NAME = 'AVAILABLE_VISIT_SECTIONS';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('name').notNullable().unique();
                table.text('module').nullable();
            });
        default:
            break;
    }
};