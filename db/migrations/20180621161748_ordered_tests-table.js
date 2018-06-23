/*eslint no-unused-vars: "off"*/

exports.up = function(knex, ignore) {
    return knex.schema.createTable('ORDERED_TESTS', function(table) {
        table.increments('id').primary();
        table.integer('orderedDuringVisit').notNullable().references('id').inTable('VISITS');
        table.integer('type').notNullable().references('id').inTable('AVAILABLE_TEST_TYPES');
        table.text('expectedOccurDate').notNullable();
        table.text('actualOccuredDate').nullable();
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['orderedDuringVisit', 'type', 'expectedOccurDate', 'deleted']);
    });
};

exports.down = function(knex, ignore) {
    return knex.schema.dropTable('ORDERED_TESTS');
};
