exports.up = (knex) => knex.schema.createTable('DOMINANT_HANDS', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('DOMINANT_HANDS');
