import imageModes from './defaults_v11/pregnancyImagingModes.json';

export const TABLE_NAME = 'PREGNANCY_IMAGING_MODES';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 18:
            if (await dbcon().schema.hasTable(TABLE_NAME) === false) {
                await dbcon().schema.createTable(TABLE_NAME, (table) => {
                    table.increments('id').primary().notNullable();
                    table.text('value').notNullable();
                    table.text('deleted').notNullable().defaultTo('-');
                    table.unique(['value', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
                });
                await dbcon()(TABLE_NAME).insert(imageModes);
            }
            break;
        default:
            break;
    }
};