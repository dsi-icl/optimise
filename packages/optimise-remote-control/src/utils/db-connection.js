import { MongoClient } from 'mongodb';

let connection;

export default () => new Promise((resolve, reject) => {
    if (connection === undefined) {
        MongoClient.connect(global.config.mongo).then(client => {
            connection = client;
            resolve(connection);
        }).catch(err => {
            if (err !== null)
                reject(err);
        });
    } else
        resolve(connection);
});