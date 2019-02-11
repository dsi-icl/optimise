const TABLE_NAME = 'PATIENT_DIAGNOSIS';

export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, function (table) {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.integer('diagnosis').notNullable().references('id').inTable('AVAILABLE_DIAGNOSES');
                table.text('diagnosisDate').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'diagnosis', 'deleted']);
            });
        default:
            break;
    }
};