exports.up = function (knex) {
    return knex.schema.createTable('TYPES', function (table) {
        table.increments('id').notNullable().primary();
        table.text('value').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('TYPES');
};
