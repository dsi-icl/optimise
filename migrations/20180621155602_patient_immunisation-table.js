
exports.up = function(knex, Promise) {
  return knex.schema.createTable('PATIENT_IMMUNISATION', function(table) {
    table.increments('id').primary();
    table.integer('patient').notNullable().references('id').inTable('PATIENTS');
    table.text('vaccineName').notNullable();
    table.text('immunisationDate').notNullable();
    table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('PATIENT_IMMUNISATION');
};
