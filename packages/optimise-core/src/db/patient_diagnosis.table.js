import { tableMove, tableCopyBack } from '../utils/';

export const TABLE_NAME = 'PATIENT_DIAGNOSIS';
export const PRIORITY = 2;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
        case 2:
        case 3:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, function (table) {
                table.increments('id').primary();
                table.integer('patient').notNullable().references('id').inTable('PATIENTS').onDelete('CASCADE');
                table.integer('diagnosis').notNullable().references('id').inTable('AVAILABLE_DIAGNOSES');
                table.text('diagnosisDate').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['patient', 'diagnosis', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};