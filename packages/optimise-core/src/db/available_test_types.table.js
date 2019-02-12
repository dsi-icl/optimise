import availableTestTypes from './defaults/testTypes.json';

export const TABLE_NAME = 'AVAILABLE_TEST_TYPES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('module').nullable();
                table.text('name').notNullable().unique();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['name', 'deleted']);
            });
            return dbcon(TABLE_NAME).insert(availableTestTypes);
        default:
            break;
    }
};