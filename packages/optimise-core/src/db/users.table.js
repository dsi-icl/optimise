import { generateAndHash } from '../utils/generate-crypto';
let hashedAdmin;

export const TABLE_NAME = 'USERS';
export const PRIORITY = 0;
export default async (dbcon, version) => {
    switch (version) {
        case 1:
            if (await dbcon.schema.hasTable(TABLE_NAME) === true)
                await dbcon.schema.renameTable(TABLE_NAME, `ARCHIVE_${Date.now()}_${TABLE_NAME}`);
            await dbcon.schema.createTable(TABLE_NAME, (table) => {
                table.increments('id').primary();
                table.text('username').notNullable();
                table.text('realname').notNullable();
                table.text('pw').notNullable();
                table.text('salt').notNullable();
                table.integer('iterations').notNullable();
                table.integer('adminPriv').notNullable();
                table.timestamp('createdTime').notNullable().defaultTo(dbcon.fn.now());
                table.integer('createdByUser').notNullable().references('id').inTable('USERS');
                table.text('deleted').notNullable().defaultTo('-');
                table.unique(['username', 'deleted'], `UNIQUE_${Date.now()}_${TABLE_NAME}`);
            });
            hashedAdmin = generateAndHash('admin');
            return dbcon(TABLE_NAME).insert([
                { id: 1, username: 'admin', realName: 'Administrator', pw: hashedAdmin.hashed, salt: hashedAdmin.salt, iterations: hashedAdmin.iteration, adminPriv: 1, createdByUser: 1 }, //pw: 'admin'
            ]);
        default:
            break;
    }
};
exports.down = (dbcon) => dbcon.schema.droptable('USERS');
