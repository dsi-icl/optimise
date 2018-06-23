/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('CLINICAL_EVENTS', function(table) {
        table.increments('id').primary();
        table.integer('patient').nullable().references('id').inTable('PATIENTS');
        table.integer('recordedDuringVisit').nullable().references('id').inTable('VISITS');
        table.integer('type').notNullable().references('id').inTable('AVAILABLE_CLINICAL_EVENT_TYPES');
        table.text('dateStartDate').notNullable();
        table.text('enDate').nullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('CLINICAL_EVENTS');
};
