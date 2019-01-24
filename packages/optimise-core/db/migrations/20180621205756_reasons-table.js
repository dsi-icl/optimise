exports.up = (knex) => knex.schema.createTable('REASONS', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
    table.text('module').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('REASONS');
