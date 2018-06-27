exports.up = function (knex) {
    return knex.schema.createTable('MEDICAL_HISTORY', function (table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS');
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
};

exports.down = function (knex) {
    return knex.schema.dropTable('MEDICAL_HISTORY');
};
