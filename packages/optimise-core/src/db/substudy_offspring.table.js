export const TABLE_NAME = 'SUBSTUDY_OFFSPRING';
export const PRIORITY = 5;
export default async (dbcon, version) => {
    switch (version) {
        case 24: {
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('offspringAlias').notNullable();
                table.integer('pregnancyId').notNullable().references('id').inTable('SUBSTUDY_PREGNANCY');
                table.text('data').notNullable();
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['offspringAlias', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            break;
        }
        default:
            break;
    }
};
