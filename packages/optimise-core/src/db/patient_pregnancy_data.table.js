import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'PATIENT_PREGNANCY_DATA';
export const PRIORITY = 4;
export default async (dbcon, version) => {

    switch (version) {
        case 18:

            await tableMove(TABLE_NAME, version);

            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                //table.integer('pregnancyId').notNullable().references('id').inTable('PATIENT_PREGNANCY').onDelete('CASCADE');
                table.integer('pregnancyId').references('id').inTable('PATIENT_PREGNANCY').onDelete('CASCADE');
                table.text('date').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.text('dataType').notNullable(); // 'baseline', 'followup', 'term'
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.integer('visitId').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');

                //baseline
                table.text('LMP');
                table.text('maternalAgeAtLMP');
                table.text('maternalBMI');
                table.text('EDD'); // both followup and baseline
                table.text('ART');
                table.text('numOfFoetuses'); // both followup and baseline
                table.text('folicAcidSuppUsed'); // both followup and baseline
                table.text('folicAcidSuppUsedStartDate'); // both followup and baseline
                table.text('illicitDrugUse'); // both followup and baseline

                // term
                table.text('inductionOfDelivery');
                table.text('lengthOfPregnancy');
                table.text('pregnancyOutcome');
                table.text('congenitalAbnormality');
                table.text('modeOfDelivery');
                table.text('useOfEpidural');
                table.text('birthWeight');
                table.text('sexOfBaby');
                table.text('APGAR0');
                table.text('APGAR5');
                table.text('everBreastFed');
                table.text('breastfeedStart');
                table.text('exclusiveBreastfeedEnd');
                table.text('mixedBreastfeedEnd');
                table.text('admission12');
                table.text('admission36');
                table.text('admission60');
                table.text('developmentalOutcome');

                //table.unique(['pregnancyId', 'date', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            // }
            break;

        default:
            break;
    }
};



