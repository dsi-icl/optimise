
exports.up = function(knex, Promise) {
    return knex.schema.createTable('AVAILABLE_FIELDS_TESTS', function(table) {
      table.increments('id').primary();
      table.text('definition').notNullable();
      table.text('idname').notNullable();
      table.integer('type').notNullable().references('id').inTable('TYPES');
      table.text('unit').nullable();
      table.text('module').nullable();
      table.text('referenceType').notNullable().references('id').inTable('AVAILABLE_TEST_TYPES');
      table.text('deleted').notNullable().defaultTo('-');  
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('AVAILABLE_FIELDS_TESTS');
  };
  