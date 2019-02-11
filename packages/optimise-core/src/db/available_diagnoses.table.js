const TABLE_NAME = 'AVAILABLE_DIAGNOSES';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('value').notNullable();
            });
        default:
            break;
    }
};