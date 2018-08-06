exports.up = (knex) => knex.schema.createTable('CONDITIONS', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('CONDITIONS');
