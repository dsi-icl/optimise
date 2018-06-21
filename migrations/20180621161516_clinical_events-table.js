
exports.up = function(knex, Promise) {
    return knex.schema.createTable('', function(table) {
      table.increments('id').primary();
      table.text('deleted').notNullable().defaultTo('-');
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('');
  };
  