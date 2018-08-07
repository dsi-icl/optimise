exports.up = (knex) => knex.schema.createTable('PREGNANCY_OUTCOMES', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('PREGNANCY_OUTCOMES');