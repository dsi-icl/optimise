import uuid from 'uuid/v4';
import { tableMove, tableCopyBack } from '../utils/db-mover';
import { generateAndHash } from '../utils/generate-crypto';
let hashedAdmin;

export const TABLE_NAME = 'USERS';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            await tableMove(TABLE_NAME, version);
            await schema_v1(dbcon);
            hashedAdmin = generateAndHash('admin'); //pw: 'admin'
            await dbcon()(TABLE_NAME).insert([
                { id: 1, username: 'admin', realName: 'Administrator', pw: hashedAdmin.hashed, salt: hashedAdmin.salt, iterations: hashedAdmin.iteration, adminPriv: 1, createdByUser: 1 },
            ]);
            break;
        case 3:
            const OLD_TABLE_NAME = await tableMove(TABLE_NAME, version);
            await schema_v3(dbcon);
            if (OLD_TABLE_NAME !== null) {
                const oldData = await dbcon()(OLD_TABLE_NAME).select('*');
                // We verify if we are already at version 3
                if (oldData.length > 0 && oldData[0].uuid === undefined) {
                    for (let i = 0; i < oldData.length; i++) {
                        oldData[i].uuid = uuid();
                        oldData[i].email = `${uuid().split('-')[0]}@optimise.local`;
                    }
                    await dbcon().batchInsert(TABLE_NAME, oldData, 50);
                }
            }
            break;
        default:
            break;
    }
};

const schema_v1 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.text('username').notNullable();
    table.text('realname').notNullable();
    table.text('pw').notNullable();
    table.text('salt').notNullable();
    table.integer('iterations').notNullable();
    table.integer('adminPriv').notNullable();
    table.timestamp('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['username', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});

const schema_v3 = (dbcon) => dbcon().schema.createTable(TABLE_NAME, (table) => {
    table.increments('id').primary();
    table.text('uuid').notNullable();
    table.text('username').notNullable();
    table.text('realname').notNullable();
    table.text('email').notNullable();
    table.text('pw').notNullable();
    table.text('salt').notNullable();
    table.integer('iterations').notNullable();
    table.integer('adminPriv').notNullable();
    table.timestamp('createdTime').notNullable().defaultTo(dbcon().fn.now());
    table.integer('createdByUser').notNullable().references('id').inTable('USERS');
    table.text('deleted').notNullable().defaultTo('-');
    table.unique(['username', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
});