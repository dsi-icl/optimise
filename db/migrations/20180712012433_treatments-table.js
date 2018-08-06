exports.up = (knex) => knex.schema.createTable('TREATMENTS', (table) => {
    table.increments('id').primary();
    table.integer('orderedDuringVisit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
    table.integer('drug').nullable().references('id').inTable('AVAILABLE_DRUGS');
    table.text('drug_notes').nullable();
    table.integer('dose').nullable();
    table.text('unit').nullable();
    table.text('form').nullable();
    table.text('times').nullable();
    table.text('intervalUnit').nullable();
    table.text('startDate').notNullable();
    table.text('terminatedDate').nullable();
    table.integer('terminatedReason').nullable().references('id').inTable('REASONS');
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['orderedDuringVisit', 'drug', 'deleted']);
});

exports.down = (knex) => knex.schema.dropTable('TREATMENTS');
