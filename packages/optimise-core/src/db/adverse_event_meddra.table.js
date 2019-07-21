import meddra from './defaults_v1/meddra.json';

export const TABLE_NAME = 'ADVERSE_EVENT_MEDDRA';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('code').notNullable();
                table.text('name').notNullable();
                table.integer('parent').nullable();
                table.boolean('isLeaf').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
            });
            await dbcon().batchInsert(TABLE_NAME, meddra, 100);
            break;
        default:
            break;
    }
};