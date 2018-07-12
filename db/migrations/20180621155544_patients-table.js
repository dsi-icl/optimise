exports.up = function (knex) {
    return knex.schema.createTable('PATIENTS', function (table) {
        table.increments('id').primary();
        table.text('aliasId').notNullable();
        table.text('study').notNullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['aliasId', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('PATIENTS');
};
