export const TABLE_NAME = 'PATIENT_PREGNANCY_IMAGING';
export const PRIORITY = 4;
export default async (dbcon, version) => {
    switch (version) {
        case 15:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('pregnancyDataId').notNullable().references('id').inTable('PATIENT_PREGNANCY_DATA').onDelete('CASCADE');
                table.text('date').notNullable();
                table.text('deleted').notNullable();
                table.text('mode').notNullable();
                table.text('result').notNullable();

                table.unique(['pregnancyDateId', 'date', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            break;
        default:
            break;
    }
};
