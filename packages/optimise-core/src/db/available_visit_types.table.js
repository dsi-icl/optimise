import visitTypes from './defaults/visitTypes.json';

export const TABLE_NAME = 'AVAILABLE_VISIT_TYPES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('module').nullable();
                table.text('name').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['name', 'deleted']);
            });
            return dbcon(TABLE_NAME).insert(visitTypes);
        default:
            break;
    }
};