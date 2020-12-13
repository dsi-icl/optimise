export const TABLE_NAME = 'REASONS';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary().notNullable();
                table.text('value').notNullable();
                table.text('module').notNullable();
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['value', 'module', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            await dbcon()(TABLE_NAME).insert([
                { id: 1, value: 'Patient preference', module: 'TREATMENTS' },
                { id: 2, value: 'Disease progresssion', module: 'TREATMENTS' },
                { id: 3, value: 'Death', module: 'TREATMENTS' },
                { id: 4, value: 'Permanent / Serious disability', module: 'TREATMENTS' },
                { id: 5, value: 'Prolonged hospitalization', module: 'TREATMENTS' },
                { id: 6, value: 'Pregnancy', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 7, value: 'Convenience', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 8, value: 'Adverse event', module: 'TREATMENTS_INTERRUPTIONS' },
                { id: 9, value: 'Unknown', module: 'TREATMENTS_INTERRUPTIONS' }
            ]);
            break;
        case 5:
            await dbcon()(TABLE_NAME).insert([
                { id: 10, value: 'Disease activity', module: 'TREATMENTS_INTERRUPTIONS' }
            ]);
            break;
        case 10:
            await dbcon()(TABLE_NAME).insert(
                [
                    {
                        "id": 11,
                        "value": "DMT switch",
                        "module": "TREATMENTS"
                    },
                    {
                        "id": 12,
                        "value": "Opportunistic infection",
                        "module": "TREATMENTS"
                    },
                    {
                        "id": 13,
                        "value": "Not tolerating DMT",
                        "module": "TREATMENTS"
                    },
                    {
                        "id": 14,
                        "value": "Trying to conceive",
                        "module": "TREATMENTS"
                    },
                    {
                        "id": 15,
                        "value": "Clinician decision - no longer eligible for clinical reason",
                        "module": "TREATMENTS"
                    },
                    {
                        "id": 16,
                        "value": "Entry into CTIMP",
                        "module": "TREATMENTS"
                    },
                    {
                        "id": 17,
                        "value": "Safety based on monitoring results",
                        "module": "TREATMENTS"
                    }
                ] 
            );
            break;
        case 11:
            await dbcon()(TABLE_NAME).insert(
                [
                    {
                        "id": 18,
                        "value": "New Drug Cycle",
                        "module": "TREATMENTS"

                    }
                ]
            );
        default:
            break;
    }
};
