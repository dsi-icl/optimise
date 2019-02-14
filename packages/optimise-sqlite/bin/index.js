const MODULES = process.versions.modules;
const NODE = process.versions.node;

try {
    const sqlite3 = require(`./node_sqlite3.node`);
    module.exports = sqlite3;
} catch (e) {
    console.error(e);
    throw new Error(`NodeJS ${NODE} Module ${MODULES} not compatible or 'yarn install' did not run properly.`);
}
