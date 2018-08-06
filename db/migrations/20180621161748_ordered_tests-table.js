exports.up = (knex) => knex.schema.createTable('ORDERED_TESTS', (table) => {
    table.increments('id').primary();
    table.integer('orderedDuringVisit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
    table.integer('type').notNullable().references('id').inTable('AVAILABLE_TEST_TYPES');
    table.text('expectedOccurDate').notNullable();
    table.text('actualOccurredDate').nullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['orderedDuringVisit', 'type', 'expectedOccurDate', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('ORDERED_TESTS');
