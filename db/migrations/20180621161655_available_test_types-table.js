/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('AVAILABLE_TEST_TYPES', function(table) {
        table.increments('id').primary();
        table.text('name').notNullable().unique();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('AVAILABLE_TEST_TYPES');
};
