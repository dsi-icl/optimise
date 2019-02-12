import ethnicities from './defaults/ethnicities.json';

export const TABLE_NAME = 'ETHNICITIES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
            });
            return dbcon(TABLE_NAME).insert(ethnicities);
        default:
            break;
    }
};