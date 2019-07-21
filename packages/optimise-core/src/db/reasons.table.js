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
        default:
            break;
    }
};