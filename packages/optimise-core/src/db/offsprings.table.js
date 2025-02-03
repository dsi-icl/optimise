import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { tableMove } from '../utils/db-mover';

export const TABLE_NAME = 'OFFSPRINGS';
export const PRIORITY = 5;
export default async (dbcon, version) => {
    switch (version) {
        case 19: {
            await tableMove(TABLE_NAME, version);
            await schema_v19(dbcon);
            const listOfTables = await dbcon().raw('SELECT name FROM sqlite_master WHERE type="table" ORDER BY name');
            const V18_PREGNANCY_ENTRY_TABLE_NAME = listOfTables.find((table) => table.name.match(/ARCHIVE_V18_(\d*)_PREGNANCY_ENTRY/) !== null)?.name;
            if (V18_PREGNANCY_ENTRY_TABLE_NAME !== null) {
                const oldData = (await dbcon()(V18_PREGNANCY_ENTRY_TABLE_NAME).where({ deleted: '-' }).select('*'));

                console.log('oldData', oldData);
                const pregnancies = Object.values(oldData.reduce((acc, entry) => {
                    if (!acc[entry.pregnancyId])
                        acc[entry.pregnancyId] = entry;
                    else if (moment(acc[entry.pregnancyId].createdTime, moment.ISO_8601).isBefore(moment(entry.createdTime, moment.ISO_8601)))
                        acc[entry.pregnancyId] = entry;
                    return acc;
                }, {}));
                console.log('pregnancies', pregnancies);

                const newOffsprings = [];
                pregnancies.forEach((pregnancy) => {
                    const offspings = JSON.parse(pregnancy.offsprings ?? '[]');
                    offspings.forEach((offspring) => {
                        newOffsprings.push({
                            pregnancyId: pregnancy.pregnancyId,
                            data: JSON.stringify(offspring ?? '{}'),
                            createdTime: pregnancy.createdTime,
                            createdByUser: pregnancy.createdByUser
                        });
                    });
                });
                console.log('newOffsprings', newOffsprings);
                await dbcon().batchInsert(TABLE_NAME, newOffsprings, 50);
            }
            break;
        }
        default:
            break;
    }
};

const schema_v19 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('patientId').notNullable().references('id').inTable('PATIENTS');
    table.integer('pregnancyId').notNullable().references('id').inTable('PATIENT_PREGNANCY');
    table.text('data').notNullable();
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['id', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});
