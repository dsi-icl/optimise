import { tableMove } from '../utils/';

export const TABLE_NAME = 'ALCOHOL_USAGE';
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
                { value: 'More than 3 units a day' },
                { value: 'Less than 3 units a day' },
                { value: 'Less than 3 units a week' },
                { value: 'No alcohol consumption' },
                { value: 'Unknown' }
            ]);
            break;
        default:
            break;
    }
};