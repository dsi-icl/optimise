exports.up = (knex) => knex.schema.createTable('VISIT_DATA', (table) => {
    table.increments('id').primary();
    table.integer('visit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
    table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_VISITS');
    table.text('value').notNullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['visit', 'field', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('VISIT_DATA');
