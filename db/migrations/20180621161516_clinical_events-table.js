exports.up = function (knex) {
    return knex.schema.createTable('CLINICAL_EVENTS', function (table) {
        table.increments('id').primary();
        table.integer('patient').nullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
        table.integer('recordedDuringVisit').nullable().references('id').inTable('VISITS').onDelete('CASCADE');
        table.integer('type').notNullable().references('id').inTable('AVAILABLE_CLINICAL_EVENT_TYPES');
        table.text('dateStartDate').notNullable();
        table.text('endDate').nullable();
        table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('CLINICAL_EVENTS');
};
