
exports.up = function(knex, Promise) {
    return knex.schema.createTable('AVAILABLE_CLINICAL_EVENT_TYPES', function(table) {
        table.increments('id').primary();
        table.text('name').notNullable().unique();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('AVAILABLE_CLINICAL_EVENT_TYPES');
};
