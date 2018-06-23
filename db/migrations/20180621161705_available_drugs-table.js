
exports.up = function(knex, ignore) {
    return knex.schema.createTable('AVAILABLE_DRUGS', function(table) {
        table.increments('id').primary();
        table.text('name').notNullable();
        table.text('module').nullable();
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('AVAILABLE_DRUGS');
};
