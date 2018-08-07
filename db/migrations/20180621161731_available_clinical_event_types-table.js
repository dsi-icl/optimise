exports.up = (knex) => knex.schema.createTable('AVAILABLE_CLINICAL_EVENT_TYPES', (table) => {
    table.increments('id').primary();
    table.text('module').nullable();
    table.text('name').notNullable().unique();
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['name', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('AVAILABLE_CLINICAL_EVENT_TYPES');
