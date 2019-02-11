const TABLE_NAME = 'PREGNANCY_OUTCOMES';

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