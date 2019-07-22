import { MongoClient } from 'mongodb';

let connection;

export default () => new Promise((resolve, reject) => {
    if (connection === undefined) {
        MongoClient.connect(global.config.mongo, { useNewUrlParser: true }, (err, client) => {
            if (err !== null)
                reject(err);
            connection = client;
            resolve(connection);
        });
    } else
        resolve(connection);
});