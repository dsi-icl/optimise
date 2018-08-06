exports.up = (knex) => knex.schema.createTable('AVAILABLE_DIAGNOSES', (table) => {
    table.increments('id').primary();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('AVAILABLE_DIAGNOSES');
