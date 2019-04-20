export const TABLE_NAME = 'PATIENT_DEMOGRAPHIC';
export const PRIORITY = 2;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            if (await dbcon().schema.hasTable(TABLE_NAME) === true)
                await dbcon().schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.text('DOB').notNullable();
                table.integer('gender').notNullable().references('id').inTable('GENDERS');
                table.integer('dominantHand').notNullable().references('id').inTable('DOMINANT_HANDS');
                table.integer('ethnicity').notNullable().references('id').inTable('ETHNICITIES');
                table.integer('countryOfOrigin').notNullable().references('id').inTable('COUNTRIES');
                table.integer('alcoholUsage').notNullable().references('id').inTable('ALCOHOL_USAGE');
                table.integer('smokingHistory').notNullable().references('id').inTable('SMOKING_HISTORY');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            break;
        case 2:
            // TO-DO: Migrate Alcohol data from PATIENT_DEMOGRAPHIC to VISIT_DATA
            await dbcon().table(TABLE_NAME, (table) => {
                table.dropColumn('alcoholUsage');
                table.dropColumn('smokingHistory');
            });
            await dbcon().schema
                .dropTable('ALCOHOL_USAGE')
                .dropTable('SMOKING_HISTORY');
            break;
        default:
            break;
    }
};