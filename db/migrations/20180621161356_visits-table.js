exports.up = function (knex) {
    return knex.schema.createTable('VISITS', function (table) {
        table.increments('id').primary();
        table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
        table.text('visitDate').notNullable();
        table.integer('type').notNullable().references('id').inTable('AVAILABLE_VISIT_TYPES').defaultTo(1);
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('VISITS');
};
