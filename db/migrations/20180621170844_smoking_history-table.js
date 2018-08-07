exports.up = (knex) => knex.schema.createTable('SMOKING_HISTORY', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('SMOKING_HISTORY');
