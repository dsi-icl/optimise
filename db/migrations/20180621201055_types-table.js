
exports.up = function(knex, ignore) {
    return knex.schema.createTable('TYPES', function(table){
        table.increments('id').notNullable().primary();
        table.text('value').notNullable();
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('TYPES');
};
