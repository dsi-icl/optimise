exports.up = function (knex) {
    return knex.schema.createTable('VISIT_REPORT', function (table) {
        table.increments('id').primary();
        table.text('report').notNullable();
        table.integer('visit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['visit', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('VISIT_REPORT');
};
