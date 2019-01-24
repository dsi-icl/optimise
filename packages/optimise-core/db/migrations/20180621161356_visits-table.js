exports.up = (knex) => knex.schema.createTable('VISITS', (table) => {
    table.increments('id').primary();
    table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
    table.text('visitDate').notNullable();
    table.integer('type').notNullable().references('id').inTable('AVAILABLE_VISIT_TYPES').defaultTo(1);
    table.text('communication').nullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
});

exports.down = (knex) => knex.schema.dropTable('VISITS');
