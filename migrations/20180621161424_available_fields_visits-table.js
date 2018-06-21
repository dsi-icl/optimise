
exports.up = function(knex, Promise) {
    return knex.schema.createTable('', function(table) {
      table.increments('id').primary();
      table.text('definition').notNullable();
      table.text('idname').notNullable();
      table.text('type').notNullable();
      table.text('unit').nullable();
      table.text('deleted').notNullable().defaultTo('-');  
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('');
  };
  