exports.up = function (knex) {
    return knex.schema.createTable('TEST_DATA', function (table) {
        table.increments('id').primary();
        table.integer('test').notNullable().references('id').inTable('ORDERED_TESTS');
        table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_TESTS');
        table.text('value').notNullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['test', 'field', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('TEST_DATA');
};
