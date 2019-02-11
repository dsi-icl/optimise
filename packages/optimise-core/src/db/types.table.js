const TABLE_NAME = 'TYPES';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').notNullable().primary();
                table.text('value').notNullable();
            });
        default:
            break;
    }
};