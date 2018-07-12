exports.up = function (knex) {
    return knex.schema.createTable('PREGNANCY_OUTCOMES', function (table) {
        table.increments('id').primary().notNullable();
        table.text('value').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('PREGNANCY_OUTCOMES');
};