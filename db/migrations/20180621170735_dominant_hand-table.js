exports.up = function (knex) {
    return knex.schema.createTable('DOMINANT_HANDS', function (table) {
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('DOMINANT_HANDS');
};
