exports.up = (knex) => knex.schema.createTable('TYPES', (table) => {
    table.increments('id').notNullable().primary();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('TYPES');
