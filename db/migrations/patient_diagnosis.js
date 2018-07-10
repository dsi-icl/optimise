/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('PATIENT_DIAGNOSIS', function(table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS');
        table.integer('diagnosis').notNullable().references('id').inTable('AVAILABLE_DIAGNOSES');
        table.text('diagnosisDate').notNullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['patient', 'diagnosis', 'deleted']);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('PATIENT_PREGNANCY');
};