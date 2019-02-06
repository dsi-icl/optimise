const path = require('path');
const fs = require('fs');
const versionTarget = require('../scripts/version-target');

const MODULES = process.versions.modules;
const NODE = process.versions.node;

let target = versionTarget();
const context = require.context('.', true, /\.node$/);

try {
    const sqlite3 = context(`./${target}`);
    module.exports = sqlite3;
} catch (e) {
    console.error(e);
    throw new Error(`NodeJS ${NODE} Module ${MODULES} not compatible or 'yarn install' did not run properly. (./${target})`);
}
