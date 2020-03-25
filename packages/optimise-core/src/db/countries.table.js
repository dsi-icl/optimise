import countries from './defaults_v1/countries.json';
import v7_countries from './defaults_v7/countries.json';

export const TABLE_NAME = 'COUNTRIES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['value', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert(countries);
            break;
        case 7:
            await dbcon()(TABLE_NAME).insert(v7_countries);
            break;
        default:
            break;
    }
};