import { tableMove } from '../utils/db-mover';

export const TABLE_NAME = 'LOG_ACTIONS';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await tableMove(TABLE_NAME, version);
            await dbcon().schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('router').notNullable();
                table.text('method').notNullable();
                table.text('user').notNullable();
                table.text('body').nullable();
                table.text('createdTime').notNullable().defaultTo(dbcon().fn.now());
            });
            break;
        default:
            break;
    }
};