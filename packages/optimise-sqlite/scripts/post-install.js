const path = require('path');
const fs = require('fs-extra');
const https = require('https');
const decompress = require('decompress');
const package = require('../package.json');

const PLATFORM = process.platform;
const ARCH = process.arch;
const MODULES = process.versions.modules;
const ELECTRON = process.versions.electron;

function version() {
    let NAME;
    if (ELECTRON) {
        const MINOR_RELEASE = ELECTRON.match(/\d\.\d/)[0];
        if (!MINOR_RELEASE)
            throw new Error('Electron', ELECTRON, 'release not supported');
        NAME = `electron-v${MINOR_RELEASE}-${PLATFORM}-${ARCH}`;
    } else {
        NAME = `node-v${MODULES}-${PLATFORM}-${ARCH}`;
    }
    return NAME;
}

function download(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            const buffer = []
            if (res.statusCode !== 200) return reject(res.statusMessage)
            res.on('data', data => buffer.push(data))
            res.on('end', () => resolve(Buffer.concat(buffer)))
        })
    })
}

async function main() {

    const target = version();
    const filename = target + '.tar.gz';
    const url = `https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v${package.version}/${filename}`;
    const binary = await download(url).catch(error => console.error(error, url));

    if (binary) {
        console.info(`Success downloading ${url}`)
        fs.writeFileSync(path.join(__dirname, `${target}.tar.gz`), binary)
        await decompress(path.join(__dirname, `${target}.tar.gz`), path.join(__dirname, 'sqlite3-binary'));
        try {
            fs.renameSync(path.join(__dirname, 'sqlite3-binary', target, 'node_sqlite3.node'), path.join(__dirname, '../bin/node_sqlite3.node'));
            fs.removeSync(path.join(__dirname, `${target}.tar.gz`));
            fs.removeSync(path.join(__dirname, 'sqlite3-binary'));
        } catch (e) {
            console.error(e);
        }
    }
}

main();
