exports.up = (knex) => knex.schema.createTable('CLINICAL_EVENTS_DATA', (table) => {
    table.increments('id').primary();
    table.integer('clinicalEvent').notNullable().references('id').inTable('CLINICAL_EVENTS').onDelete('CASCADE');
    table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_CE');
    table.text('value').notNullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['clinicalEvent', 'field', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('CLINICAL_EVENTS_DATA');
