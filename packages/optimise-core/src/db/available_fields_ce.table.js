import { tableMove } from '../utils/db-mover';
import ceFields from './defaults_v1/ceFields.json';
import v7_ceFields from './defaults_v7/ceFields.json';
import v8_ceFields from './defaults_v8/ceFields.json';

export const TABLE_NAME = 'AVAILABLE_FIELDS_CE';
export const PRIORITY = 1;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
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
                table.integer('referenceType').notNullable().references('id').inTable('AVAILABLE_CLINICAL_EVENT_TYPES');
                table.text('laterality').nullable();
                table.text('cdiscName').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['idname', 'type', 'unit', 'module', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert(ceFields);
            break;
        case 7:
            await dbcon()(TABLE_NAME).insert(v7_ceFields);
            break;
        case 8:
            await dbcon()(TABLE_NAME).where('idname', 'Severity').update({ permittedValues: 'Mild,Moderate,Severe,Unknown' });
            await dbcon()(TABLE_NAME).where('idname', 'Recovery').update({ permittedValues: 'Complete,Partial,None,Unknown' });
            await dbcon()(TABLE_NAME).insert(v8_ceFields);
            break;
        default:
            break;
    }
};