exports.up = (knex) => knex.schema.createTable('AVAILABLE_DRUGS', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable();
    table.text('module').nullable();
});

exports.down = (knex) => knex.schema.dropTable('AVAILABLE_DRUGS');
