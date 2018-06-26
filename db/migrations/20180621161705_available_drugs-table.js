/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('AVAILABLE_DRUGS', function(table) {
        table.increments('id').primary();
        table.text('name').notNullable();
        table.text('module').nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('AVAILABLE_DRUGS');
};
