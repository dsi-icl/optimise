const TABLE_NAME = 'AVAILABLE_FIELDS_TESTS';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('definition').notNullable();
                table.text('idname').notNullable();
                table.text('section').nullable();
                table.text('subsection').nullable();
                table.integer('type').notNullable().references('id').inTable('TYPES');
                table.text('unit').nullable();
                table.text('module').nullable();
                table.text('permittedValues').nullable();
                table.text('labels').nullable();
                table.integer('referenceType').notNullable().references('id').inTable('AVAILABLE_TEST_TYPES');
                table.text('laterality').nullable();
                table.text('cdiscName').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['idname', 'type', 'unit', 'module', 'deleted']);
            });
        default:
            break;
    }
};