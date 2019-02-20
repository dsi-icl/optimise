export const TABLE_NAME = 'TYPES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            if (await dbcon().schema.hasTable(TABLE_NAME) === true)
                await dbcon().schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').notNullable().primary();
                table.text('value').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['value', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            return dbcon()(TABLE_NAME).insert([
                { id: 1, value: 'I' },
                { id: 2, value: 'F' },
                { id: 3, value: 'C' },
                { id: 4, value: 'T' },
                { id: 5, value: 'B' },
                { id: 6, value: 'D' },
                { id: 7, value: 'BLOB' }
            ]);
        default:
            break;
    }
};