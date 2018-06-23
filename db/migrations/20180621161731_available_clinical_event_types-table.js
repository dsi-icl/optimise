/*eslint no-unused-vars: "off"*/

exports.up = function(knex, ignore) {
    return knex.schema.createTable('AVAILABLE_CLINICAL_EVENT_TYPES', function(table) {
        table.increments('id').primary();
        table.text('name').notNullable().unique();
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('AVAILABLE_CLINICAL_EVENT_TYPES');
};
