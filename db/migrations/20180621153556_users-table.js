exports.up = function (knex) {
    return knex.schema.createTable('USERS', function (table) {
        table.increments('id').primary();
        table.text('username').notNullable();
        table.text('realname').notNullable();
        table.text('pw').notNullable();
        table.text('salt').notNullable();
        table.integer('iterations').notNullable();
        table.integer('adminPriv').notNullable();
        table.timestamp('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['username', 'deleted']);
    });

};

exports.down = function (knex) {
    return knex.schema.droptable('USERS');
};
