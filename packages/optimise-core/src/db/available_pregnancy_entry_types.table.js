import availablePregnancyEntryTypes from './defaults_v11/pregnancyEntryTypes.json';

export const TABLE_NAME = 'AVAILABLE_PREGNANCY_ENTRY_TYPES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 18:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('name').notNullable();
                table.text('module').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['name', 'module', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert(availablePregnancyEntryTypes);
            break;
        default:
            break;
    }
};