import {
    tableMove
} from '../utils/db-mover';
import testFields from './defaults_v1/testFields.json';
import v9_testFields from './defaults_v9/testFields.json';
import v10_testFields from './defaults_v10/new_test_units.json';

export const TABLE_NAME = 'AVAILABLE_FIELDS_TESTS';
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
                table.integer('referenceType').notNullable().references('id').inTable('AVAILABLE_TEST_TYPES');
                table.text('laterality').nullable();
                table.text('cdiscName').nullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['idname', 'type', 'unit', 'module', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon().batchInsert(TABLE_NAME, testFields, 50);
            break;
        case 9:
            await dbcon()(TABLE_NAME).insert(v9_testFields);
            break;
        case 10:
            await dbcon()(TABLE_NAME).insert(v10_testFields);
            break;
        case 13:
            await dbcon()(TABLE_NAME).where('definition', 'Indication').update({
                permittedValues: 'Diagnosis,Monitoring,Relapse,Other Clinical Events,Baseline Scan'
            });
            break;
        default:
            break;
    }
};
