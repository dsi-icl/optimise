const TABLE_NAME = 'REASONS';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
                table.text('module').notNullable();
            });
        default:
            break;
    }
};