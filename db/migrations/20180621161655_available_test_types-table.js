exports.up = function (knex) {
    return knex.schema.createTable('AVAILABLE_TEST_TYPES', function (table) {
        table.increments('id').primary();
        table.text('module').nullable();
        table.text('name').notNullable().unique();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('AVAILABLE_TEST_TYPES');
};
