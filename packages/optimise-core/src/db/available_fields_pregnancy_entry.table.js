import {
    tableMove
} from '../utils/db-mover';
import pregnancyEntryFields from './defaults_v18/pregnancyEntryFields.json';


export const TABLE_NAME = 'AVAILABLE_FIELDS_PREGNANCY_ENTRY';
export const PRIORITY = 1;
export default async (dbcon, version) => {
    switch (version) {
        case 18:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
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
                table.integer('referenceType').notNullable().references('id').inTable('AVAILABLE_PREGNANCY_ENTRY_TYPES');
                table.text('laterality').nullable();
                table.text('cdiscName').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['idname', 'type', 'unit', 'module', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon().batchInsert(TABLE_NAME, pregnancyEntryFields, 50);
            break;
        case 19:
            await dbcon()(TABLE_NAME)
                .where('idname', 'number of foetuses')
                .orWhere('idname', 'number of offsprings')
                .orWhere('idname', 'mode of infant feeding')
                .orWhere('idname', 'duration of breastfeeding')
                .update({ deleted: `0@${(new Date()).getTime()}` });
            break;
        default:
            break;
    }
};
