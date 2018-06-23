
exports.up = function(knex, ignore) {
    return knex.schema.createTable('REASONS', function(table){
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('REASONS');
};
