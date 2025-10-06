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
        case 25:
            await dbcon()(TABLE_NAME).insert([
                { definition: 'Smoking habit', idname: 'smoking habit', section: null, subsection: null, type: 3, unit: null, module: 'MS', permittedValues: "smoker,ex-smoker,never smoked,electronic cigarette", labels: null, referenceType: 1, laterality: null, cdiscName: null, deleted: '-' },
                { definition: 'Smoking habit', idname: 'smoking habit', section: null, subsection: null, type: 3, unit: null, module: 'MS', permittedValues: "smoker,ex-smoker,never smoked,electronic cigarette", labels: null, referenceType: 2, laterality: null, cdiscName: null, deleted: '-' },
                { definition: 'Alcohol habit', idname: 'alcohol habit', section: null, subsection: null, type: 3, unit: null, module: 'MS', permittedValues: "More than 3 units a day,Less than 3 units a day,Less than 3 units a week,No alcohol consumption,Unknown", labels: null, referenceType: 1, laterality: null, cdiscName: null, deleted: '-' },
                { definition: 'Alcohol habit', idname: 'alcohol habit', section: null, subsection: null, type: 3, unit: null, module: 'MS', permittedValues: "More than 3 units a day,Less than 3 units a day,Less than 3 units a week,No alcohol consumption,Unknown", labels: null, referenceType: 2, laterality: null, cdiscName: null, deleted: '-' },
                { definition: 'Folic acid supplementation end date', idname: 'folic acid supplementation end date', section: null, subsection: null, type: 6, unit: null, module: 'MS', permittedValues: null, labels: null, referenceType: 3, laterality: null, cdiscName: null, deleted: '-' },
            ]);
            await dbcon()(TABLE_NAME)
                .where({ idname: 'maternal bmi', referenceType: 2, deleted: '-' })
                .orWhere({ idname: 'estimated date of delivery', referenceType: 2, deleted: '-' })
                .orWhere({ idname: 'folic acid supplementation', referenceType: 2, deleted: '-' })
                .orWhere({ idname: 'folic acid supplementation date', referenceType: 2, deleted: '-' })
                .orWhere({ idname: 'gestational age at delivery', deleted: '-' })
                .orWhere({ idname: 'mode of infant feeding', deleted: '-' })
                .orWhere({ idname: 'duration of breastfeeding', deleted: '-' })
                .orWhere({ idname: 'date of last menstrual period', deleted: '-' })
                .update({ deleted: `0@${(new Date()).getTime()}` });
            break;
        default:
            break;
    }
};
