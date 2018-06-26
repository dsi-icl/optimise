/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('AVAILABLE_VISIT_TYPES', function(table){
        table.increments('id').primary();
        table.text('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('AVAILABLE_VISIT_TYPES');
};
