exports.up = function (knex) {
    return knex.schema.createTable('AVAILABLE_TEST_TYPES', function (table) {
        table.increments('id').primary();
        table.text('module').nullable();
        table.text('name').notNullable().unique();
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['name', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('AVAILABLE_TEST_TYPES');
};
