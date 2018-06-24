/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('REASONS', function(table){
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
        table.text('module').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('REASONS');
};
