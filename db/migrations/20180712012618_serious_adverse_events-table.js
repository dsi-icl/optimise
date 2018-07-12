exports.up = function (knex) {
    return knex.schema.createTable('SERIOUS_ADVERSE_EVENTS', function (table) {
        table.increments('id').primary();
        table.integer('treatment').notNullable().references('id').inTable('TREATMENTS');
        table.text('adverseEventDate').notNullable();
        table.integer('reason').notNullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['treatment', 'adverseEventDate', 'reason', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('SERIOUS_ADVERSE_EVENTS');
};
