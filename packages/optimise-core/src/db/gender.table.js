import { tableMove } from '../utils/';

export const TABLE_NAME = 'GENDERS';
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
                { value: 'male' },
                { value: 'female' },
                { value: 'other' },
                { value: 'prefer not to say' }
            ]);
            break;
        default:
            break;
    }
};