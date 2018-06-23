/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('COUNTRIES', function(table){
        table.increments('id').primary().notNullable();
        table.text('country').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('COUNTRIES');
};
