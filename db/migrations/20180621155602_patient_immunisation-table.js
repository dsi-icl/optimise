
exports.up = function(knex, ignore) {
    return knex.schema.createTable('PATIENT_IMMUNISATION', function(table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS');
        table.text('vaccineName').notNullable();
        table.text('immunisationDate').notNullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['patient', 'vaccineName', 'immunisationDate']);
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('PATIENT_IMMUNISATION');
};
