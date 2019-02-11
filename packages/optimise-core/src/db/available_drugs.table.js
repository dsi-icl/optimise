const TABLE_NAME = 'AVAILABLE_DRUGS';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('name').notNullable();
                table.text('module').nullable();
            });
        default:
            break;
    }
};