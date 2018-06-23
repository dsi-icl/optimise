
exports.up = function(knex, ignore) {
    return knex.schema.createTable('AVAILABLE_VISIT_TYPES', function(table){
        table.increments('id').notNullable().primary();
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('AVAILABLE_VISIT_TYPES');
};
