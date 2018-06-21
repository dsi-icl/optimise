
exports.up = function(knex, Promise) {
    return knex.schema.createTable('', function(table) {
      table.increments('id').primary();
      table.integer('patient').notNullable().references('id'),inTable('PATIENTS');
      table.integer('relation').notNullable().references('id').inTable('RELATIONS');
      table.integer('conditionName').notNullable().references('id').inTable('CONDITIONS');
      table.text('startDate');
      table.text('outcome').notNullable();
      table.text('startDate');
      table.integer('resolvedYear');
      table.text('createdTime').notNullable().defaultTo(knex.fn.now());
      table.integer('createdByUser').notNullable().references('id').inTable('USERS');
      table.text('deleted').notNullable().defaultTo('-');  
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('');
  };
