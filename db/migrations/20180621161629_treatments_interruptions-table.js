exports.up = function (knex) {
    return knex.schema.createTable('TREATMENTS_INTERRUPTIONS', function (table) {
        table.increments('id').primary();
        table.integer('treatment').notNullable().references('id').inTable('TREATMENTS');
        table.text('startDate').notNullable();
        table.text('endDate').nullable();
        table.integer('reason').nullable().references('id').inTable('REASONS');
        table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['treatment', 'startDate', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('TREATMENTS_INTERRUPTIONS');
};
