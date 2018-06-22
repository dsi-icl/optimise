
exports.up = function(knex, Promise) {
    return knex.schema.createTable('TEST_DATA', function(table) {
      table.increments('id').primary();
      table.integer('visit').notNullable().references('id').inTable('VISITS');
      table.integer('field').notNullable().references('id').inTable('AVAILABLE_FIELDS_VISITS');
      table.text('value').notNullable();
      table.text('createdTime').notNullable().defaultTo(knex.fn.now());
      table.integer('createdByUser').notNullable().references('id').inTable('USERS');
      table.text('deleted').notNullable().defaultTo('-');  
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('TEST_DATA');
  };
  