exports.up = function (knex) {
    return knex.schema.createTable('PATIENT_PII', function (table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS');
        table.text('firstName').notNullable();
        table.text('surname').notNullable();
        table.text('fullAddress').notNullable();
        table.text('postcode').notNullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['patient', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('PATIENT_PII');
};