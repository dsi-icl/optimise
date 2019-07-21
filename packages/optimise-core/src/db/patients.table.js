import { tableMove, tableCopyBack } from '../utils/db-mover';

export const TABLE_NAME = 'PATIENTS';
export const PRIORITY = 1;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
        case 2:
            await tableMove(TABLE_NAME, version);
            await schema_v1(dbcon);
            await tableCopyBack(TABLE_NAME);
            break;
        case 3:
            await tableMove(TABLE_NAME, version);
            await schema_v3(dbcon);
            await tableCopyBack(TABLE_NAME);
            break;
        default:
            break;
    }
};

const schema_v1 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.boolean('consent').notNullable().defaultTo(false);
    table.text('uuid').notNullable();
    table.text('aliasId').notNullable();
    table.text('study').notNullable();
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['aliasId', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});

const schema_v3 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.boolean('consent').notNullable().defaultTo(false);
    table.boolean('participation').notNullable().defaultTo(true);
    table.text('uuid').notNullable();
    table.text('aliasId').notNullable();
    table.text('study').notNullable();
    table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['aliasId', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});