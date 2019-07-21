import { tableMove } from '../utils/';
import data from './defaults_v2/icd11_data.json';

export const TABLE_NAME = 'ICD11';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 2:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('code').notNullable();
                table.text('name').notNullable();
                table.integer('parent').nullable();
                table.boolean('isLeaf').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
            });
            await dbcon().batchInsert(TABLE_NAME, data, 100);
            break;
        default:
            break;
    }
};