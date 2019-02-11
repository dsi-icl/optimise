export const TABLE_NAME = 'ADVERSE_EVENT_MEDDRA';
export const PRIORITY = 0;
export default (dbcon, version) => {
    switch (version) {
        case 1:
            return dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('code').notNullable();
                table.text('name').notNullable();
                table.integer('parent').nullable();
                table.boolean('isLeaf').notNullable();
            });
        default:
            break;
    }
};