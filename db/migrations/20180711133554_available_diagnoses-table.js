exports.up = function (knex) {
    return knex.schema.createTable('AVAILABLE_DIAGNOSES', function (table) {
        table.increments('id').primary();
        table.text('value').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('AVAILABLE_DIAGNOSES');
};
