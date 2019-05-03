export const TABLE_NAME = 'COMORBIDITY';
export const PRIORITY = 3;
export default async (dbcon, version) => {
    switch (version) {
        case 2:
            if (await dbcon().schema.hasTable(TABLE_NAME) === true)
                await dbcon().schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.integer('visit').notNullable().references('id').inTable('VISITS').onDelete('CASCADE');
                table.integer('comorbidity').notNullable().references('id').inTable('ICD11').onDelete('CASCADE');
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['visit', 'comorbidity', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            break;
        default:
            break;
    }
};