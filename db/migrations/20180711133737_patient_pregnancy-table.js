exports.up = function (knex) {
    return knex.schema.createTable('PATIENT_PREGNANCY', function (table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
        table.text('startDate').notNullable();
        table.integer('outcome').nullable().references('id').inTable('PREGNANCY_OUTCOMES');
        table.text('outcomeDate').nullable();
        table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['patient', 'startDate', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('PATIENT_PREGNANCY');
};