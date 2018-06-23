/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('VISITS', function(table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS');
        table.text('visitDate').notNullable();
        table.integer('type').notNullable().references('id').inTable('AVAILABLE_VISIT_TYPES').defaultTo(1);
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['patient', 'visitDate', 'deleted']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('VISITS');
};
