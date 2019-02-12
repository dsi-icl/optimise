import visitSections from './defaults/visitSections.json';

export const TABLE_NAME = 'AVAILABLE_VISIT_SECTIONS';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('name').notNullable().unique();
                table.text('module').nullable();
            });
            return dbcon(TABLE_NAME).insert(visitSections);
        default:
            break;
    }
};