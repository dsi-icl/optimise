/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('USER_SESSION', function(table){
        table.increments('id').primary();
        table.integer('user').notNullable().references('id').inTable('USERS');
        table.text('sessionStartDate').notNullable().defaultTo(knex.fn.now());
        table.text('sessionToken').notNullable();
        table.text('deleted').notNullable().defaultTo('-');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.droptable('USER_SESSION');
};
