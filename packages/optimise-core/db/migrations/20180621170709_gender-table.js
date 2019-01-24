exports.up = (knex) => knex.schema.createTable('GENDERS', (table) => {
    table.increments('id').primary().notNullable();
    table.text('value').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('GENDERS');
