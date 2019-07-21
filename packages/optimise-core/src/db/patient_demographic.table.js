import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'PATIENT_DEMOGRAPHIC';
export const PRIORITY = 2;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await tableMove(TABLE_NAME, version);
            await schema_v1(dbcon);
            break;
        case 2:
            const OLD_TABLE_NAME = await tableMove(TABLE_NAME, version);
            await schema_v2(dbcon);
            if (OLD_TABLE_NAME !== null) {
                const oldData = await dbcon()(OLD_TABLE_NAME).select('*');
                // We verify if we are already at version 2
                if (oldData.length > 0 && oldData[0].smokingHistory !== undefined) {

                    const eligiblePatients = await dbcon()(OLD_TABLE_NAME).select('*').where({ deleted: '-' });
                    const smokingHash = (await dbcon()('SMOKING_HISTORY').select('*')).reduce((a, e) => { a[e.id] = e.value; return a; }, {});
                    const alcoholHash = (await dbcon()('ALCOHOL_USAGE').select('*')).reduce((a, e) => { a[e.id] = e.value; return a; }, {});

                    for (let each of eligiblePatients) {

                        /* copying data to visit data */
                        const patientID = each['patient'];
                        const alcoholUsage = each['alcoholUsage'];
                        const smokingHistory = each['smokingHistory'];
                        const createdByUser = each['createdByUser'];
                        const eligibleVisits = (await dbcon()('VISITS').min('id').where({ patient: patientID, deleted: '-', type: 1 }));

                        if (eligibleVisits.length > 0) {

                            const maxVisitId = eligibleVisits[0]['min(`id`)'];
                            if (maxVisitId !== null && maxVisitId !== undefined) {
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
                        }
                    }

                    for (let i = 0; i < oldData.length; i++) {
                        delete oldData[i].alcoholUsage;
                        delete oldData[i].smokingHistory;
                    }

                    await dbcon().batchInsert(TABLE_NAME, oldData, 50);
                }
            }
            break;
        case 3:
            await tableMove(TABLE_NAME, version);
            await schema_v2(dbcon);
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};

const schema_v1 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
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

const schema_v2 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
    table.text('DOB').notNullable();
    table.integer('gender').notNullable().references('id').inTable('GENDERS');
    table.integer('dominantHand').notNullable().references('id').inTable('DOMINANT_HANDS');
    table.integer('ethnicity').notNullable().references('id').inTable('ETHNICITIES');
    table.integer('countryOfOrigin').notNullable().references('id').inTable('COUNTRIES');
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['patient', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});