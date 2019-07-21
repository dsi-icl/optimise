import { tableMove } from '../utils/';
import availableCETypes from './defaults_v1/ceTypes.json';

export const TABLE_NAME = 'AVAILABLE_CLINICAL_EVENT_TYPES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('name').notNullable();
                table.text('module').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['name', 'module', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert(availableCETypes);
            break;
        default:
            break;
    }
};