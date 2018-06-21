
exports.up = function(knex, Promise) {
    return knex.schema.createTable('', function(table) {
  
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('');
  };
  