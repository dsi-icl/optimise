exports.up = (knex) => knex.schema.createTable('AVAILABLE_VISIT_SECTIONS', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable().unique();
    table.text('module').nullable();
});

exports.down = (knex) => knex.schema.dropTable('AVAILABLE_VISIT_SECTIONS');