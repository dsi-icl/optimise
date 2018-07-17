exports.up = function (knex) {
    return knex.schema.createTable('TREATMENTS', function (table) {
        table.increments('id').primary();
        table.integer('orderedDuringVisit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
        table.integer('drug').notNullable().references('id').inTable('AVAILABLE_DRUGS');
        table.integer('dose').notNullable();
        table.text('unit').notNullable();
        table.text('form').notNullable();
        table.integer('timesPerDay').notNullable();
        table.integer('durationWeeks').notNullable();
        table.text('terminatedDate').nullable();
        table.integer('terminatedReason').nullable().references('id').inTable('REASONS');
        table.text('createdTime').notNullable().defaultTo(knex.fn.now());
        table.integer('createdByUser').notNullable().references('id').inTable('USERS');
        table.text('deleted').notNullable().defaultTo('-');
        table.unique(['orderedDuringVisit', 'drug', 'deleted']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('TREATMENTS');
};
