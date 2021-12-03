/*eslint no-console: "off"*/
import dbcon from './db-connection';
import schemas from '../db';
import fs from 'fs';

// Current level of the DB
// This field is to be updated with subsequent versions of the DB
const CURRENT_VERSION = 13;

export async function migrate() {

    // Verify the OPT_KV configuration table exists
    const isIntitialized = await dbcon().schema.hasTable('OPT_KV');
    let stepVersion = 0;

    if (!isIntitialized) {
        // If not create it and initialize CURRENT_VERSION
        await dbcon().schema.createTable('OPT_KV', function (table) {
            table.string('key').primary();
            table.string('value');
            table.timestamps();
        });
        await dbcon()('OPT_KV').insert({
            key: 'CURRENT_VERSION',
            value: '0',
            created_at: dbcon().fn.now(),
            updated_at: dbcon().fn.now()
        });
    } else {
        // Otherwise fetch the CURRENT_VERSION
        let stepVersionResult = await dbcon()('OPT_KV').where({
            key: 'CURRENT_VERSION'
        }).select('value');

        if (stepVersionResult.length === 1 && stepVersionResult[0].value !== undefined)
            stepVersion = parseInt(stepVersionResult[0].value) || 0;
    }

    if (stepVersion !== CURRENT_VERSION) {

        if (CURRENT_VERSION < stepVersion)
            return Promise.reject(new Error('The existing database was created with a newer version of Optimise ! Please upgrade before using Optimise !'));

        // For every table file launch the update for sequential version up
        while (stepVersion < CURRENT_VERSION) {
            stepVersion++;
            try {
                for (let i = 0; i < schemas.length; i++)
                    await schemas[i](dbcon, stepVersion);
            } catch (error) {
                console.error(error.message);
                console.error(error.stack);
                return Promise.reject(error);
            }
        }

        // Finally set the CURRENT_VERSION to the current level
        await dbcon()('OPT_KV').where({
            key: 'CURRENT_VERSION'
        }).update({
            value: `${stepVersion}`,
            updated_at: dbcon().fn.now()
        });
    }

    return dbcon;
}

export function erase() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'test') {
            if (process.env.NODE_ENV === 'development') console.log('Removing database file ...');
            let filename = dbcon().client.config.connection.filename;
            try {
                if (fs.existsSync(filename))
                    fs.unlinkSync(filename);
            } catch (err) {
                return reject(err);
            }
        }
        return resolve();
    });
}

export default {
    migrate,
    erase
};
