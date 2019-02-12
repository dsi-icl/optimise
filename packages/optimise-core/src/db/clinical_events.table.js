export const TABLE_NAME = 'CLINICAL_EVENTS';
export const PRIORITY = 3;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            if (await dbcon.schema.hasTable(TABLE_NAME) === true)
                await dbcon.schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('patient').nullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.integer('recordedDuringVisit').nullable().references('id').inTable('VISITS').onDelete('CASCADE');
                table.integer('type').notNullable().references('id').inTable('AVAILABLE_CLINICAL_EVENT_TYPES');
                table.text('dateStartDate').notNullable();
                table.text('endDate').nullable();
                table.integer('meddra').nullable().references('id').inTable('ADVERSE_EVENT_MEDDRA');
                table.text('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
            });
            break;
        default:
            break;
    }
};