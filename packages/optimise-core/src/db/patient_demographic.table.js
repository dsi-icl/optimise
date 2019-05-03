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
        {
            const existingPatientsInThisTable = await dbcon()(TABLE_NAME).select('*');
            const smokingHash = (await dbcon()('SMOKING_HISTORY').select('*')).reduce((a, e) => { a[e.id] = e.value; return a; }, {});
            const alcoholHash = (await dbcon()('ALCOHOL_USAGE').select('*')).reduce((a, e) => { a[e.id] = e.value; return a; }, {});

            for (let each of existingPatientsInThisTable) {
                const patientID = each['patient'];
                const alcoholUsage = each['alcoholUsage'];
                const smokingHistory = each['smokingHistory'];
                const createdByUser = each['createdByUser'];
                // TO_DO: translate from 1 - text
                const maxVisitId = (await dbcon()('VISITS').max('id').where({ patient: patientID, deleted: '-' }))[0]['max(`id`)'];
                if (maxVisitId === null) { continue; }
                await dbcon()('VISIT_DATA').insert([
                    {
                        visit: maxVisitId,
                        field: 252,
                        value: smokingHash[smokingHistory],
                        createdByUser
                    },
                    {
                        visit: maxVisitId,
                        field: 253,
                        value: alcoholHash[alcoholUsage],
                        createdByUser
                    },
                ]);
            }
            await dbcon().table(TABLE_NAME, (table) => {
                table.dropForeign('alcoholUsage');
                table.dropForeign('smokingHistory');
                table.dropColumn('alcoholUsage');
                table.dropColumn('smokingHistory');
            });
            await dbcon().schema
                .dropTable('ALCOHOL_USAGE')
                .dropTable('SMOKING_HISTORY');
            break;
        }
        default:
            break;
    }
};