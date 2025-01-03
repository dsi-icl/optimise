import { tableMove } from '../utils/db-mover';
import pregnancyOutcomes from './defaults_v1/pregnancyOutcomes.json';

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
            await dbcon()(TABLE_NAME).insert(pregnancyOutcomes);
            break;
        default:
            break;
    }
};