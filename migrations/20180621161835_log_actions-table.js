
exports.up = function(knex, Promise) {
    return knex.schema.createTable('', function(table) {
      table.increments('id').primary();
      table.text('router').notNullable();
      table.text('method').notNullable();
      table.text('user').notNullable();
      table.text('body').nullable();
      table.text('createdTime').notNullable().defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('');
  };
  