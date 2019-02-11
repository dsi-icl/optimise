export const TABLE_NAME = 'PATIENT_PREGNANCY';
export const PRIORITY = 2;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.text('startDate').notNullable();
                table.integer('outcome').nullable().references('id').inTable('PREGNANCY_OUTCOMES');
                table.text('outcomeDate').nullable();
                table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'startDate', 'deleted']);
            });
        default:
            break;
    }
};