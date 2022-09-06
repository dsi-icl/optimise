export const TABLE_NAME = 'PATIENT_PREGNANCY_DATA';
export const PRIORITY = 3;
export default async (dbcon, version) => {
    switch (version) {
        case 12:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('pregnancyId').notNullable().references('id').inTable('PATIENT_PREGNANCY').onDelete('CASCADE');
                table.text('date').notNullable();
                table.text('deleted').notNullable();
                table.text('dataType').notNullable(); 
                table.text('LMP');
                table.text('maternalAgeAtLMP');
                table.text('EDD'); 
                table.text('ART');
                table.text('numOfFoetuses'); 
                table.text('folicAcidSuppUsed'); 
                table.text('folicAcidSuppUsedStartDate'); 
                table.text('illicitDrugUse'); 
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
                table.unique(['pregnancyId', 'date', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};
