import meddra from './defaults/meddra.json';

export const TABLE_NAME = 'ADVERSE_EVENT_MEDDRA';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('code').notNullable();
                table.text('name').notNullable();
                table.integer('parent').nullable();
                table.boolean('isLeaf').notNullable();
            });
            return dbcon(TABLE_NAME).insert(meddra);
        default:
            break;
    }
};