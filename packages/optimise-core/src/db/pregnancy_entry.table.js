import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'PREGNANCY_ENTRY';
export const PRIORITY = 4;
export default async (dbcon, version) => {
    switch (version) {
        case 18:
            await tableMove(TABLE_NAME, version);
            await schema_v18(dbcon);
            await tableCopyBack(TABLE_NAME);
            break;
        case 19: {
            const OLD_TABLE_NAME = await tableMove(TABLE_NAME, version);
            await schema_v19(dbcon);
            if (OLD_TABLE_NAME !== null) {
                const oldData = await dbcon()(OLD_TABLE_NAME).select('*');
                if (oldData.length) {
                    for (let i = 0; i < oldData.length; i++) {
                        delete oldData[i].offsprings;
                    }
                    await dbcon().batchInsert(TABLE_NAME, oldData, 50);
                }
            }
            break;
        }
        default:
            break;
    }
};

const schema_v18 = dbcon => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('recordedDuringVisit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
    table.integer('type').notNullable().references('id').inTable('AVAILABLE_PREGNANCY_ENTRY_TYPES');
    table.integer('pregnancyId').notNullable().references('id').inTable('PATIENT_PREGNANCY');
    table.text('offsprings').nullable();
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['recordedDuringVisit', 'type', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});

const schema_v19 = dbcon => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.integer('recordedDuringVisit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
    table.integer('type').notNullable().references('id').inTable('AVAILABLE_PREGNANCY_ENTRY_TYPES');
    table.integer('pregnancyId').notNullable().references('id').inTable('PATIENT_PREGNANCY');
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['recordedDuringVisit', 'type', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});
