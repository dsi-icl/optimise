/*eslint no-unused-vars: "off"*/

exports.up = function(knex, ignore) {
    return knex.schema.createTable('ETHNICITIES', function(table){
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('ETHNICITIES');
};
