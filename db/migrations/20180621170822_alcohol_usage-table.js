
exports.up = function(knex, Promise) {
    return knex.schema.createTable('ALCOHOL_USAGE', function(table){
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('ALCOHOL_USAGE');
};
