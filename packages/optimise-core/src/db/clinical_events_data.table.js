const TABLE_NAME = 'CLINICAL_EVENTS_DATA';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('clinicalEvent').notNullable().references('id').inTable('CLINICAL_EVENTS').onDelete('CASCADE');
                table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_CE');
                table.text('value').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['clinicalEvent', 'field', 'deleted']);
            });
        default:
            break;
    }
};