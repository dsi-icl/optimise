/*eslint no-unused-vars: "off"*/

exports.up = function(knex, ignore) {
    return knex.schema.createTable('COUNTRIES', function(table){
        table.increments('id').primary().notNullable();
        table.text('country').notNullable();
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('COUNTRIES');
};
