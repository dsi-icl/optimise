/*eslint no-unused-vars: "off"*/

exports.up = function(knex, ignore) {
    return knex.schema.createTable('LOG_ACTIONS', function(table) {
        table.increments('id').primary();
        table.text('router').notNullable();
        table.text('method').notNullable();
        table.text('user').notNullable();
        table.text('body').nullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('LOG_ACTIONS');
};
