/*eslint no-console: "off"*/
import data from './data';

export default async (dbcon) => {
    for (let each in data) {
        await dbcon()(each).del();
        await dbcon()(each).insert(data[each]);
    }
};
