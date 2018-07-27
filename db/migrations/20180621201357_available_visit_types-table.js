exports.up = function (knex) {
    return knex.schema.createTable('AVAILABLE_VISIT_TYPES', function (table) {
        table.increments('id').primary();
        table.text('module').nullable();
        table.text('value').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('AVAILABLE_VISIT_TYPES');
};
