export const TABLE_NAME = 'DOMINANT_HANDS';
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
            await dbcon()(TABLE_NAME).insert([
                { value: 'left' },
                { value: 'right' },
                { value: 'ambidextrous' },
                { value: 'amputated' }
            ]);
            break;
        case 6:
            await dbcon()(TABLE_NAME).insert([
                { value: 'Unknown' },
                { value: 'Prefer not to say' }
            ]);
            break;
        default:
            break;
    }
};