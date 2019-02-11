const TABLE_NAME = 'LOG_ACTIONS';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('router').notNullable();
                table.text('method').notNullable();
                table.text('user').notNullable();
                table.text('body').nullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
            });
        default:
            break;
    }
};