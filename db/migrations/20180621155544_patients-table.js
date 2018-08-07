exports.up = (knex) => knex.schema.createTable('PATIENTS', (table) => {
    table.increments('id').primary();
    table.boolean('consent').notNullable().defaultTo(false);
    table.text('uuid').notNullable();
    table.text('aliasId').notNullable();
    table.text('study').notNullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['aliasId', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('PATIENTS');
