import ceFields from './defaults/ceFields.json';

export const TABLE_NAME = 'AVAILABLE_FIELDS_CE';
export const PRIORITY = 1;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('definition').notNullable();
                table.text('idname').notNullable();
                table.text('section').nullable();
                table.text('subsection').nullable();
                table.integer('type').notNullable().references('id').inTable('TYPES');
                table.text('unit').nullable();
                table.text('module').nullable();
                table.text('permittedValues').nullable();
                table.text('labels').nullable();
                table.integer('referenceType').notNullable().references('id').inTable('AVAILABLE_CLINICAL_EVENT_TYPES');
                table.text('laterality').nullable();
                table.text('cdiscName').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['idname', 'type', 'unit', 'module', 'deleted']);
            });
            return dbcon(TABLE_NAME).insert(ceFields);
        default:
            break;
    }
};