export const TABLE_NAME = 'USERS';
export const PRIORITY = 0;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('username').notNullable();
                table.text('realname').notNullable();
                table.text('pw').notNullable();
                table.text('salt').notNullable();
                table.integer('iterations').notNullable();
                table.integer('adminPriv').notNullable();
                table.timestamp('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['username', 'deleted']);
            });
        default:
            break;
    }
};
exports.down = (dbcon) => dbcon.schema.droptable('USERS');
