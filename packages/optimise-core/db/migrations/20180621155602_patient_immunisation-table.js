exports.up = (knex) => knex.schema.createTable('PATIENT_IMMUNISATION', (table) => {
    table.increments('id').primary();
    table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
    table.text('vaccineName').notNullable();
    table.text('immunisationDate').notNullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['patient', 'vaccineName', 'immunisationDate', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('PATIENT_IMMUNISATION');
