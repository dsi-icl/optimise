export const TABLE_NAME = 'SUBSTUDY_PREGNANCY';
export const PRIORITY = 4;
export default async (dbcon, version) => {
    switch (version) {
        case 24:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('pregnancyAlias').notNullable();
                table.integer('patientId').nullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.text('data').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['pregnancyAlias', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            break;
        default:
            break;
    }
};
