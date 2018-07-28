exports.up = function (knex) {
    return knex.schema.createTable('AVAILABLE_FIELDS_TESTS', function (table) {
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
};

exports.down = function (knex) {
    return knex.schema.dropTable('AVAILABLE_FIELDS_TESTS');
};
