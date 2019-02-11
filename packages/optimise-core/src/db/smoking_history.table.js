const TABLE_NAME = 'SMOKING_HISTORY';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
            });
        default:
            break;
    }
};