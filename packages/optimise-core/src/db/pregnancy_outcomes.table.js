import { tableMove } from '../utils/db-mover';
import pregnancyOutcomes_v1 from './defaults_v1/pregnancyOutcomes.json';
import pregnancyOutcomes_v20 from './defaults_v20/pregnancyOutcomes.json';

export const TABLE_NAME = 'PREGNANCY_OUTCOMES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['value', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert(pregnancyOutcomes_v1);
            break;
        case 20: {
            const oldTableName = await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
                table.text('detail').nullable();
                table.text('scope').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['value', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            const oldData = await dbcon()(oldTableName).select();
            for (let i = 0; i < oldData.length; i++) {
                oldData[i].scope = 'main';
                oldData[i].detail = null;
            }
            dbcon().batchInsert(TABLE_NAME, oldData, 50);
            for (const record of pregnancyOutcomes_v20) {
                if (record['prev:value']) {
                    const newRecord = {
                        ...record
                    };
                    delete newRecord['prev:value'];
                    await dbcon()(TABLE_NAME)
                        .where({ value: record['prev:value'] })
                        .update(newRecord, ['id']);
                }
                else {
                    await dbcon()(TABLE_NAME).insert(record);
                }
            }
            break;
        }
        case 22:
            await dbcon()(TABLE_NAME).insert({
                value: 'Incomplete prior pregnancy record',
                detail: null,
                scope: 'system',
                deleted: `0@${new Date().getTime()}`
            });
            break;
        default:
            break;
    }
};
