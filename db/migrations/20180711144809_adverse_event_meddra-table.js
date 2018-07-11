exports.up = function (knex) {
    return knex.schema.createTable('ADVERSE_EVENT_MEDDRA', function(table){
        table.increments('id').primary().notNullable();
        table.text('name').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('ADVERSE_EVENT_MEDDRA');
};