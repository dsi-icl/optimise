import { tableMove } from '../utils/db-mover';

export const TABLE_NAME = 'SMOKING_HISTORY';
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
            await dbcon()(TABLE_NAME).insert([
                { value: 'smoker' },
                { value: 'ex-smoker' },
                { value: 'never smoked' },
                { value: 'electronic cigarette' }
            ]);
            break;
        default:
            break;
    }
};