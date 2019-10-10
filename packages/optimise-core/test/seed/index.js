import data from './data';

export default async (dbcon) => {
    for (let i = 0; i < data.length; i++) {
        await dbcon()(data[i][0]).del();
        await dbcon()(data[i][0]).insert(data[i][1]);
    }
};
