exports.up = function (knex) {
    return knex.schema.createTable('AVAILABLE_VISIT_SECTIONS', function (table) {
        table.increments('id').primary();
        table.text('name').notNullable().unique();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('AVAILABLE_VISIT_SECTIONS');
};