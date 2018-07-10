/*eslint no-unused-vars: "off"*/

exports.up = function(knex, Promise) {
    return knex.schema.createTable('ADVERSE_EVENT_MEDDRA', function(table){
        table.increments('id').primary().notNullable();
        table.text('name').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('ADVERSE_EVENT_MEDDRA');
};