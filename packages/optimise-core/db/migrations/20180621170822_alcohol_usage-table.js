exports.up = (knex) => knex.schema.createTable('ALCOHOL_USAGE', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('ALCOHOL_USAGE');
