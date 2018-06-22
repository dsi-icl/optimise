
exports.up = function(knex, Promise) {
  return knex.schema.createTable('USERS', function(table) {
      table.increments('id').primary();
      table.text('username');
      table.text('realname');
      table.text('pw').notNullable();
      table.text('adminPriv').notNullable();
      table.timestamp('createdTime').notNullable().defaultTo(knex.fn.now());
      table.integer('createdByUser').notNullable().references('id').inTable('USERS');
      table.integer('deleted').notNullable().defaultTo('-');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.droptable('USERS');
};
