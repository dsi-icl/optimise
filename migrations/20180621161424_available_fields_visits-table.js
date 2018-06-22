
exports.up = function(knex, Promise) {
    return knex.schema.createTable('AVAILABLE_FIELDS_VISITS', function(table) {
      table.increments('id').primary();
      table.text('definition').notNullable();
      table.text('idname').notNullable();
      table.integer('type').notNullable().references('id').inTable('TYPES');
      table.text('unit').nullable();
      table.text('module').nullable();
      table.text('permittedValues').nullable();
      table.text('referenceType').notNullable().references('id').inTable('AVAILABLE_VISITS_TYPES');
      table.text('deleted').notNullable().defaultTo('-');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('AVAILABLE_FIELDS_VISITS');
  };
  