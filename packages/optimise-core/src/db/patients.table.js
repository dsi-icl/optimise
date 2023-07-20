import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'PATIENTS';
export const PRIORITY = 1;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
        case 2:
            await tableMove(TABLE_NAME, version);
            await schema_v1(dbcon);
            await tableCopyBack(TABLE_NAME);
            break;
        case 3:
            await tableMove(TABLE_NAME, version);
            await schema_v3(dbcon);
            await tableCopyBack(TABLE_NAME);
            break;
        case 16: {
            const OLD_TABLE_NAME = await tableMove(TABLE_NAME, version);
            await schema_v16(dbcon);
            if (OLD_TABLE_NAME !== null) {
                const oldData = await dbcon()(OLD_TABLE_NAME).select('*');
                if (Array.isArray(oldData) && oldData.length) {
                    for (let i = 0; i < oldData.length; i++) {
                        oldData[i].optimiseConsent = null;
                        if (oldData[i].deleted === '-' && Boolean(oldData[i].consent) === true) {
                            if (oldData[i].study !== 'optimise')
                                oldData[i].optimiseConsent = oldData[i].study;
                            else
                                oldData[i].optimiseConsent = oldData[i].createTime;
                        }
                        delete oldData[i].consent;
                        delete oldData[i].study;
                    }
                    await dbcon().batchInsert(TABLE_NAME, oldData, 50);
                }
            }
            break;
        }
        case 17: {
            const listOfTables = await dbcon().raw('SELECT name FROM sqlite_master WHERE type="table" ORDER BY name');
            const V15_TABLE_NAME = listOfTables.find((table) => table.name.match(/ARCHIVE_V15_(\d*)_PATIENTS/) !== null).name;
            const OLD_TABLE_NAME = await tableMove(TABLE_NAME, version);
            await schema_v16(dbcon);
            if (OLD_TABLE_NAME !== null) {
                const oldData = await dbcon()(OLD_TABLE_NAME).select('*');
                if (Array.isArray(oldData) && oldData.length) {
                    for (let i = 0; i < oldData.length; i++) {
                        if (oldData[i].optimiseConsent === null) {
                            const recordPointsOld = await dbcon()(OLD_TABLE_NAME).where({
                                uuid: oldData[i].uuid
                            });
                            const v15Data = await dbcon()(V15_TABLE_NAME)
                                .where({
                                    uuid: oldData[i].uuid
                                });
                            if (Array.isArray(recordPointsOld) && recordPointsOld.length && Array.isArray(v15Data) && v15Data.length && recordPointsOld.length === v15Data.length) {
                                const v15Tip = v15Data.find((v15) => v15.deleted === '-');
                                if (v15Tip && v15Tip.id === oldData[i].id) {
                                    if (v15Tip.study !== 'optimise')
                                        oldData[i].optimiseConsent = v15Tip.study;
                                    else
                                        oldData[i].optimiseConsent = v15Tip.createdTime;
                                }
                            }
                        }
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

const schema_v1 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.boolean('consent').notNullable().defaultTo(false);
    table.text('uuid').notNullable();
    table.text('aliasId').notNullable();
    table.text('study').notNullable();
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['aliasId', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});

const schema_v3 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.boolean('consent').notNullable().defaultTo(false);
    table.boolean('participation').notNullable().defaultTo(true);
    table.text('uuid').notNullable();
    table.text('aliasId').notNullable();
    table.text('study').notNullable();
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['aliasId', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});

const schema_v16 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.boolean('participation').notNullable().defaultTo(true);
    table.text('uuid').notNullable();
    table.text('aliasId').notNullable();
    table.text('optimiseConsent').nullable();
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['aliasId', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});
