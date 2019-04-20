import visitFields from './defaults_v1/visitFields.json';

export const TABLE_NAME = 'AVAILABLE_FIELDS_VISITS';
export const PRIORITY = 1;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            if (await dbcon().schema.hasTable(TABLE_NAME) === true)
                await dbcon().schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('definition').notNullable();
                table.text('idname').notNullable();
                table.integer('section').notNullable().references('id').inTable('AVAILABLE_VISIT_SECTIONS');
                table.text('subsection').nullable();
                table.integer('type').notNullable().references('id').inTable('TYPES');
                table.text('unit').nullable();
                table.text('module').nullable();
                table.text('permittedValues').nullable();
                table.text('labels').nullable();
                table.integer('referenceType').notNullable().references('id').inTable('AVAILABLE_VISIT_TYPES');
                table.text('laterality').nullable();
                table.text('cdiscName').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['idname', 'type', 'unit', 'module', 'referenceType', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon().batchInsert(TABLE_NAME, visitFields, 50);
            break;
        default:
            break;
    }
};