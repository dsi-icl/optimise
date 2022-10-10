import data from './defaults_v8/concomitant_meds.json';

export const TABLE_NAME = 'AVAILABLE_CONCOMITANT_MED';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 8:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('name').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
            });
            await dbcon().batchInsert(TABLE_NAME, data, 100);
            break;
        case 12:
            await dbcon()(TABLE_NAME).insert([
                {
                    id: 47,
                    name: 'Amitriptyline'
                },
                {
                    id: 48,
                    name: 'Mirabegron (Solifenacin)'
                }
            ]);
            break;
        default:
            break;
    }
};