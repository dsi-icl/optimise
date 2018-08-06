exports.up = (knex) => knex.schema.createTable('ETHNICITIES', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('ETHNICITIES');
