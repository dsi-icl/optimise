
exports.up = function(knex, ignore) {
    return knex.schema.createTable('USERS', function(table) {
        table.increments('id').primary();
        table.text('username').notNullable();
        table.text('realname');
        table.text('pw').notNullable();
        table.integer('adminPriv').notNullable();
        table.timestamp('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.integer('deleted').notNullable().defaultTo('-');
        table.unique(['username', 'deleted']);
    });

};

exports.down = function(knex, ignore) {
    return knex.schema.droptable('USERS');
};
