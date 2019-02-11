const TABLE_NAME = 'VISIT_REPORT';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('report').notNullable();
                table.integer('visit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['visit', 'deleted']);
            });
        default:
            break;
    }
};