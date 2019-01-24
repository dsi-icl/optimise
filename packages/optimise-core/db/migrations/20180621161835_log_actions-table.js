exports.up = (knex) => knex.schema.createTable('LOG_ACTIONS', (table) => {
    table.increments('id').primary();
    table.text('router').notNullable();
    table.text('method').notNullable();
    table.text('user').notNullable();
    table.text('body').nullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('LOG_ACTIONS');
