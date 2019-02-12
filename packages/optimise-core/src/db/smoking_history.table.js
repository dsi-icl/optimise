export const TABLE_NAME = 'SMOKING_HISTORY';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
            });
            return dbcon(TABLE_NAME).insert([
                { value: 'smoker' },
                { value: 'ex-smoker' },
                { value: 'never smoked' },
                { value: 'electronic cigarette' }
            ]);
        default:
            break;
    }
};