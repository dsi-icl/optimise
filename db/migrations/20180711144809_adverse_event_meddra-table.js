exports.up = (knex) => knex.schema.createTable('ADVERSE_EVENT_MEDDRA', (table) => {
    table.increments('id').primary().notNullable();
    table.text('code').notNullable();
    table.text('name').notNullable();
    table.integer('parent').nullable();
    table.boolean('isLeaf').notNullable();
});

exports.down = (knex) => knex.schema.dropTable('ADVERSE_EVENT_MEDDRA');