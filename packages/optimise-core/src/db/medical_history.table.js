export const TABLE_NAME = 'MEDICAL_HISTORY';
export const PRIORITY = 2;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.integer('relation').notNullable().references('id').inTable('RELATIONS');
                table.integer('conditionName').notNullable().references('id').inTable('CONDITIONS');
                table.text('startDate');
                table.text('outcome').notNullable();
                table.integer('resolvedYear');
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'relation', 'conditionName', 'startDate', 'deleted']);
            });
        default:
            break;
    }
};