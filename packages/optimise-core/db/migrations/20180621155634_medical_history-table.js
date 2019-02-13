exports.up = (knex) => knex.schema.createTable('MEDICAL_HISTORY', (table) => {
    table.increments('id').primary();
    table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
    table.integer('relation').notNullable().references('id').inTable('RELATIONS');
    table.integer('conditionName').notNullable().references('id').inTable('CONDITIONS');
    table.text('startDate');
    table.text('outcome').notNullable();
    table.integer('resolvedYear');
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['patient', 'relation', 'conditionName', 'startDate', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('MEDICAL_HISTORY');
