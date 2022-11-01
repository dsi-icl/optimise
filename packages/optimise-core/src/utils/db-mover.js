/*eslint no-console: "off"*/
import dbcon from './db-connection';

const mapper = {};

export async function tableMove(TABLE_NAME, version) {
    if (await dbcon().schema.hasTable(TABLE_NAME) === true) {
        mapper[TABLE_NAME] = `ARCHIVE_V${version - 1}_${Date.now()}_${TABLE_NAME}`;
        await dbcon().schema.renameTable(TABLE_NAME, mapper[TABLE_NAME]);
        return mapper[TABLE_NAME];
    }
    return null;
}

export async function tableCopyBack(TABLE_NAME) {
    let pointer = null;
    if (mapper[TABLE_NAME] === undefined)
        return;
    pointer = await dbcon()(mapper[TABLE_NAME]).select();
    return dbcon().batchInsert(TABLE_NAME, pointer, 50);
}

export default {
    tableMove,
    tableCopyBack
};